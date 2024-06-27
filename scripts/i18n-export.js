const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const prettier = require('prettier');
const babel = require('@babel/core');
const parser = require('@babel/parser');

const outDir = path.resolve('src/livecodes/i18n/locales/tmp');
const enOutDir = path.resolve('src/livecodes/i18n/locales/en');
const srcBaseDir = path.resolve('src/livecodes');

const prettierConfig = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};

/**
 * Saved translations.
 */
const trans = {
  translation: {},
  'language-info': {},
};

/**
 * Structured JSON for Lokalise.
 */
const structuredJSON = {
  translation: {},
  'language-info': {},
};

/**
 * `JSON.stringify` with keys sorted.
 * @param {object} obj
 * @param {number} space
 */
const sortedJSONify = (obj, space = 2) =>
  JSON.stringify(
    obj,
    (key, value) =>
      value instanceof Object && !(value instanceof Array)
        ? Object.keys(value)
          .sort()
          .reduce((sorted, key) => {
            sorted[key] = value[key];
            return sorted;
          }, {})
        : value,
    space,
  );

/**
 * Write translation to .ts and .lokalise.json files.
 * @param {'translation' | 'languageInfo'} namespace
 * @param {boolean} overwriteMode
 */
const writeTranslation = async (namespace, overwriteMode) => {
  const name = namespace === 'translation' ? 'translation' : 'languageInfo';
  const type = namespace === 'translation' ? 'I18nTranslation' : 'I18nLangInfoTranslation';
  const code = `import type { I18nTranslationTemplate } from '../models';

    // This is used as a template for other translations.
    // Other translations should be typed like this:
    // const ${name}: ${type} = { /* translation here */ };

    // Since we allow nested objects, it is important to distinguish I18nTranslationTemplate from I18nAttributes.
    // In view of this, properties declared in I18nAttributes (and those attributes might be used in future) shall not be used as a nested key.
    
    const ${name} = ${sortedJSONify(trans[namespace])} as const satisfies I18nTranslationTemplate;
    
    export default ${name};
  `;

  const translationContent = await prettier.format(code, {
    parser: 'typescript',
    ...prettierConfig,
  });

  await Promise.all([
    fs.promises.writeFile(path.resolve(outDir, namespace + '.ts'), translationContent),

    // Save structured JSON for lokalise
    fs.promises.writeFile(
      path.resolve(outDir, namespace + '.lokalise.json'),
      sortedJSONify(structuredJSON[namespace]).replace(/<(\/?)([0-9]+)>/g, '<$1tag-$2>'),
    ),
  ]);

  console.log(`Generated namespace ${namespace} in ${outDir}.`);

  if (overwriteMode) {
    await fs.promises.copyFile(
      path.resolve(outDir, namespace + '.ts'),
      path.resolve(enOutDir, namespace + '.ts'),
    );
    console.log(`Copied to ${enOutDir}.`);
  }
};

/**
 * Add a translation entry to `trans` and `structuredJSON`.
 * @param {string} nsKey Key with namespace.
 * @param {string} value
 * @param {string} desc Description for Lokalise.
 * @param {string[]} props Props that needs to be translated.
 */
const addTranslation = (nsKey, value, desc, props) => {
  nsKey = nsKey.split(':');
  const key = nsKey.pop();
  const namespace = nsKey.length === 1 ? nsKey.pop() : 'translation';

  const parts = key.split('.');
  let current = trans[namespace];
  parts.forEach((part, index) => {
    if (!current[part]) {
      current[part] = index === parts.length - 1 ? value : {};
    } else {
      if (index === parts.length - 1 && current[part] !== value) {
        console.error(`Duplicate key: ${key}`);
      }
    }
    current = current[part];
  });

  if (!props || props.length == 1) {
    structuredJSON[namespace][key] = {
      translation: value,
      notes: desc,
    };
  } else {
    props.forEach((prop) => {
      structuredJSON[namespace][key + `#${prop}`] = {
        translation: value[prop],
        notes: desc[prop],
      };
    });
  }
};

/**
 * Abstractify HTML string. Convert all tags to a format like `<0>`, `<1>`, etc.
 *
 * Should be kept same as the one in `src/livecodes/i18n/utils.ts`.
 *
 * @param {string} html The HTML string to abstractify.
 * @returns The abstractified HTML string, with a list of objects of their tag names and attributes.
 */
const abstractifyHTML = (html) => {
  const doc = new jsdom.JSDOM(html).window.document;
  const elements = [];

  let counter = 0;

  const replaceElement = (node) => {
    if (node.nodeType !== doc.ELEMENT_NODE) return;

    node.childNodes.forEach((child) => {
      replaceElement(child);
    });

    const name = node.tagName.toLowerCase();
    if (name === 'body') return;

    const attributes =
      node.attributes.length === 0
        ? undefined
        : Array.from(node.attributes).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, {});

    elements.push({ name, attributes });

    const newElement = doc.createElement(`tag-${counter}`);
    while (node.firstChild) {
      newElement.appendChild(node.firstChild);
    }

    // node.parentNode is always defined because we're traversing from the body
    node.parentNode.replaceChild(newElement, node);

    counter++;
  };

  replaceElement(doc.body);

  // Make tag numbering consistent with Lokalise
  // Tag generated by `replaceElement` is in deep-first order, while Lokalise is left-to-right order
  let newCounter = 1;
  const closing = [];
  let htmlString = doc.body.innerHTML.replace(/tag-/g, '');
  const newElements = [];
  htmlString = htmlString.replace(/<([0-9]+)>/g, (_, p1) => {
    newElements.push(elements[p1]);

    // Replace corresponding closing tag to a special tag, in order to avoid replaced tag being replaced again
    closing.push({ from: new RegExp(`</${p1}>`, 'g'), to: `<*/${newCounter}>` });

    return `<${newCounter++}>`;
  });
  closing.forEach(({ from, to }) => {
    htmlString = htmlString.replace(from, to);
  });
  htmlString = htmlString.replace(/<\*\//g, '</');

  return {
    html: htmlString,
    elements: newElements,
  };
};

/**
 * Generate note for Lokalise from elements.
 * @param {object[]} elements List of elements.
 * @returns {string} Note for Lokalise.
 */
const generateElementsNote = (elements) =>
  elements
    .map(
      (el, index) =>
        `### <${index}> ###\n<${el.name} ${el.attributes
          ? Object.keys(el.attributes)
            .map((attr) => `${attr}="${el.attributes[attr]}"`)
            .join(' ')
          : ''
        } />\n\n`,
    )
    .join('');

const processHTML = async (files) => {
  const getValueAndContext = (element, prop) => {
    if (prop === 'innerHTML') {
      const { html, elements } = abstractifyHTML(element.innerHTML);
      return {
        value: html,
        desc: generateElementsNote(elements),
      };
    }
    const value = prop.startsWith('data-') ? element.dataset[prop.slice(5)] : element[prop];
    return {
      value: value.trim(),
      desc: '',
    };
  };

  // Hardcoded translations for main page
  addTranslation('translation:splash.loading', 'Loading LiveCodes…', '', ['textContent']);

  await Promise.all(
    files.map(async (file) => {
      try {
        // console.log(`Processing ${file}...`);

        const data = (await fs.promises.readFile(file, 'utf8')).replace(/\s+/g, ' ').trim();
        const html = new jsdom.JSDOM(data).window.document;

        html.querySelectorAll('[data-i18n]').forEach((element) => {
          const key = element.getAttribute('data-i18n');
          const props = (element.getAttribute('data-i18n-prop') ?? 'textContent').split(' ');

          const { value, desc } =
            props.length == 1
              ? getValueAndContext(element, props[0])
              : props.reduce(
                (acc, prop) => {
                  const vd = getValueAndContext(element, prop);
                  acc.value[prop] = vd.value;
                  acc.desc[prop] = vd.desc;
                  return acc;
                },
                { value: {}, desc: {} },
              );

          addTranslation(key, value, desc, props);
        });
      } catch (err) {
        console.error(err);
      }
    }),
  );
};

const processTS = async (files) => {
  await Promise.all(
    files.map(async (file) => {
      try {
        // console.log(`Processing ${file}...`);

        const data = await fs.promises.readFile(file, 'utf8');
        const ast = parser.parse(data, {
          sourceType: 'module',
          plugins: ['typescript'],
        });

        // Find all following two calls
        babel.traverse(ast, {
          CallExpression(path) {
            if (
              path.node.callee.type === 'MemberExpression' &&
              path.node.callee.property.type === 'Identifier' &&
              path.node.callee.property.name === 'translateString' &&
              path.node.arguments.length >= 2 &&
              path.node.arguments[0].type === 'StringLiteral' &&
              path.node.arguments[1].type === 'StringLiteral'
            ) {
              if (
                !path.node.arguments[2] ||
                path.node.arguments[2].properties.every(
                  (prop) =>
                    !prop.key ||
                    !prop.value ||
                    prop.key.name !== 'isHTML' ||
                    (prop.key.name === 'isHTML' && prop.value.value !== true),
                )
              ) {
                addTranslation(
                  path.node.arguments[0].value,
                  path.node.arguments[1].value,
                  '',
                  undefined,
                );
              } else {
                const { html, elements } = abstractifyHTML(path.node.arguments[1].value);
                addTranslation(
                  path.node.arguments[0].value,
                  html,
                  generateElementsNote(elements),
                  undefined,
                );
              }
            }
          },
        });
      } catch (err) {
        console.error(err);
      }
    }),
  );
};

/**
 * Generate .ts and .lokalise.json files from .html and .ts files.
 *
 * If no files are provided, it will process all relevant files in the base directory.
 */
const generateTranslation = async () => {
  const files = process.argv.slice(2).filter((file) => !file.startsWith('-'));
  const overwriteMode = process.argv.includes('--overwrite');

  const HTMLFiles = [],
    TSFiles = [];

  if (!files.length) {
    files.push(...fs.readdirSync(srcBaseDir, { recursive: true }));
  }

  HTMLFiles.push(
    ...files
      .filter((file) => file.endsWith('.html') && file.startsWith('html\\'))
      .map((file) => path.resolve(srcBaseDir, file)),
  );
  TSFiles.push(
    ...files.filter((file) => file.endsWith('.ts')).map((file) => path.resolve(srcBaseDir, file)),
  );

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  await processHTML(HTMLFiles);
  await processTS(TSFiles);

  writeTranslation('translation', overwriteMode);
  if (Object.keys(trans['language-info']).length > 0) {
    writeTranslation('language-info', overwriteMode);
  }
};

module.exports = { generateTranslation, sortedJSONify, prettierConfig };

if (require.main === module) {
  generateTranslation();
}
