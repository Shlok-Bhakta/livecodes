import { getLanguageEditorId } from '../languages';
import { Config } from '../models';
import { defaultConfig } from './default-config';

interface genericConfig extends Config {
  [x: string]: any;
}

const upgradeSteps = [
  {
    to: '0.4.0',
    upgrade: (oldConfig: genericConfig, version: string): genericConfig => {
      let config: genericConfig = clone(oldConfig);
      config = renameProperty(config, 'update_delay', 'delay');
      config = renameProperty(config, 'allow_lang_change', 'allowLangChange');
      if ('autoprefixer' in config) {
        config.processors = clone(defaultConfig.processors);
        config.processors.postcss.autoprefixer = config.autoprefixer;
        delete config.autoprefixer;
      }
      if ('baseUrl' in config) {
        delete config.baseUrl;
      }
      if ('cssPreset' in config && config.cssPreset === null) {
        config.cssPreset = '';
      }
      if ('editor' in config && typeof config.editor !== 'string') {
        config.editor = '';
      }
      if ('language' in config) {
        config.activeEditor = getLanguageEditorId(config.language);
        delete config.language;
      }

      interface Module {
        name: string;
        url?: string;
        typesUrl?: string;
      }
      if ('modules' in config) {
        const imports = {
          ...config.modules.reduce(
            (acc: Record<string, string>, mod: Module) => ({
              ...acc,
              ...(mod.url ? { [mod.name]: mod.url } : {}),
            }),
            {} as Record<string, string>,
          ),
        };
        if (Object.keys(imports).length > 0) {
          config.imports = imports;
        }

        const types = {
          ...config.modules.reduce(
            (acc: Record<string, string>, mod: Module) => ({
              ...acc,
              ...(mod.typesUrl ? { [mod.name]: mod.typesUrl } : {}),
            }),
            {} as Record<string, string>,
          ),
        };
        if (Object.keys(types).length > 0) {
          config.types = types;
        }
        delete config.modules;
      }
      return {
        ...config,
        version,
      };
    },
  },
].sort((a, b) => (isEarlier({ version: a.to, comparedTo: b.to }) ? -1 : 1));

export const upgradeConfig = (oldConfig: genericConfig) => {
  const oldVersion = isValidVersion(oldConfig.version) ? oldConfig.version : '0.0.0';
  const currentVersion = defaultConfig.version;

  if (isEarlier({ version: currentVersion, comparedTo: oldVersion })) {
    throw new Error(
      `Unsupported config version '${oldVersion}'. Current LiveCodes version is '${currentVersion}'`,
    );
  }
  if (oldVersion === currentVersion) return oldConfig;

  return upgradeSteps.reduce(
    (config, step) =>
      isEarlier({ version: config.version, comparedTo: step.to })
        ? step.upgrade(config, step.to)
        : config,
    oldConfig,
  );
};

const isValidVersion = (version: any) => {
  if (typeof version !== 'string') return false;
  const numbers = version.split('.');
  if (numbers.length !== 3) return false;
  if (numbers.map((n) => Number(n)).filter(isNaN).length !== 0) return false;
  return true;
};

const isEarlier = ({ version, comparedTo }: { version: string; comparedTo: string }) => {
  if (!version) return true;
  const versionNumbers = version.split('.').map((n) => Number(n));
  const comparedToNumbers = comparedTo.split('.').map((n) => Number(n));
  for (const i in versionNumbers) {
    if (versionNumbers[i] < comparedToNumbers[i]) return true;
  }
  return false;
};

const clone = (obj: any) => JSON.parse(JSON.stringify(obj));

const renameProperty = (obj: any, oldProp: string, newProp: string) => {
  const { [oldProp]: _, ...newObj } = {
    ...obj,
    ...(oldProp in obj ? { [newProp]: obj[oldProp] } : {}),
  };
  return newObj;
};
