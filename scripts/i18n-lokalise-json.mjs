// Generate Lokalise JSON files from TypeScript src files in src/livecodes/i18n/locales/<lang> directory.

import fs from 'fs';
import path from 'path';
import babel from '@babel/core';
import parser from '@babel/parser';
import { autoGeneratedWarning, sortedJSONify } from './i18n-export.js';

const flatten = (obj, prefix = '') =>
  Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (typeof value === 'object') {
      return { ...acc, ...flatten(value, `${prefix}${key}.`) };
    }
    return { ...acc, [`${prefix}${key}`]: value };
  }, {});

const parseObject = (node) => {
  if (!node) {
    throw new Error('Node is undefined or null');
  }
  const result = {};
  node.properties.forEach((prop) => {
    const key = prop.key.name || prop.key.value;
    result[key] = parseValue(prop.value);
  });
  return result;
}

const parseValue = (node) => {
  switch (node.type) {
    case "ObjectExpression":
      return parseObject(node);
    case "ArrayExpression":
      return node.elements.map(parseValue);
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return node.value;
    case "NullLiteral":
      return null;
    default:
      throw new Error(`Unsupported node type: ${node.type}`);
  }
}

const generateLokaliseJSON = async () => {
  const lang = process.argv[2];
  const srcDir = path.resolve('src/livecodes/i18n/locales/' + lang);
  if (!fs.existsSync(srcDir)) {
    console.error(`Language ${srcDir} does not exist.`);
    return;
  }

  const files = fs
    .readdirSync(srcDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => path.resolve(srcDir, file));

  await Promise.all(
    files.map(async (file) => {
      try {
        console.log(`Generating Lokalise JSON for ${file} in language ${lang}...`);

        const data = await fs.promises.readFile(file, 'utf8');
        const ast = parser.parse(data, {
          sourceType: 'module',
          plugins: ['typescript'],
        });

        // Find first ObjectExpression and load it
        let translation;
        babel.traverse(ast, {
          ObjectExpression(path) {
            translation = parseObject(path.node);
            path.stop();
          },
        });

        const result = { $comment: autoGeneratedWarning.substring(3) };
        for (const [key, value] of Object.entries(flatten(translation))) {
          result[key] = { translation: value };
        }

        const outFile = path.resolve(srcDir, file.replace('.ts', '.lokalise.json'));
        await fs.promises.writeFile(outFile, sortedJSONify(result).replace(/<(\/?)(\d+)>/g, '<$1tag-$2>'));
      } catch (err) {
        console.error(err);
      }
    }),
  );
};

generateLokaliseJSON();
