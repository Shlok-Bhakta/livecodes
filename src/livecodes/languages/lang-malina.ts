import { compileAllBlocks } from '../compiler';
import { LanguageSpecs } from '../models';
import { acornUrl, astringUrl, cjs2esUrl, csstreeUrl, malinaUrl } from '../vendors';
import { parserPlugins } from './prettier';
import { getLanguageCustomSettings } from './utils';

export const malina: LanguageSpecs = {
  name: 'malina',
  title: 'Malina.js',
  parser: {
    name: 'html',
    pluginUrls: [parserPlugins.html, parserPlugins.babel],
  },
  compiler: {
    factory: () => {
      (self as any).importScripts(acornUrl, astringUrl, csstreeUrl, cjs2esUrl);
      (self as any)['css-tree'] = (self as any).csstree; // yes, this is required!!
      (self as any).importScripts(malinaUrl);

      return async (code, { config }) => {
        const processedCode = await compileAllBlocks(code, config, {
          removeEnclosingTemplate: true,
        });

        try {
          const result = await (self as any).malina.compile(processedCode, {
            exportDefault: false,
            inlineTemplate: true,
            autoSubscribe: true,
            name: 'Component',
            localConfig: false,
            // autoimport: (name: string) => `import ${name} from './${name}.xht';`,
            ...getLanguageCustomSettings('malina', config),
          });

          const init = `\nComponent(document.querySelector("#app") || document.body);\n`;
          if (result.result) {
            return result.result + init;
          }
          return '';
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn(e);
          return '';
        }
      };
    },
  },
  extensions: ['xht'],
  editor: 'script',
  editorLanguage: 'html',
};
