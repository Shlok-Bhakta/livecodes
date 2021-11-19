import { ContentConfig } from '../models';
import { loadScript } from '../utils';
import { localforageUrl } from '../vendors';
import { ProjectStorage, SavedProject, StorageItem } from './models';

type LocalForage = typeof import('localforage');
let localforage: LocalForage;
const dbName = 'livecodes';
const stores: Record<string, LocalForage> = {};

const loadLocalforage = async (store: string) => {
  if (!localforage) {
    localforage = (await loadScript(localforageUrl, 'localforage')) as LocalForage;
    localforage.config({
      name: dbName,
    });
  }
  if (!stores[store]) {
    stores[store] = localforage.createInstance({
      name: dbName,
      storeName: store,
    });
  }
};

/**
 * Creates asynchronous data store using localforage
 */
export const createStorage = async (name: string): Promise<ProjectStorage> => {
  let store: LocalForage;

  const load = async () => {
    await loadLocalforage(name);
    store = stores[name];
  };

  const getList = async (): Promise<SavedProject[]> => {
    await load();
    const list: SavedProject[] = [];
    await store.iterate((item: StorageItem, key) => {
      list.push({
        id: key,
        title: item.config?.title || '',
        description: item.config?.description || '',
        tags: item.config?.tags || [],
        languages: item.config
          ? [item.config.markup.language, item.config.style.language, item.config.script.language]
          : [],
        lastModified: item.lastModified,
      });
    });
    return list.sort((a, b) => b.lastModified - a.lastModified);
  };

  const getAllData = async (): Promise<StorageItem[]> => {
    await load();
    const list: StorageItem[] = [];
    await store.iterate((item: StorageItem) => {
      list.push(item);
    });
    return list.sort((a, b) => b.lastModified - a.lastModified);
  };

  const getItem = async (itemId: string): Promise<StorageItem | null> => {
    await load();
    return store.getItem(itemId);
  };

  const updateItem = async (id: string, config: ContentConfig) => {
    await load();
    const newItem: StorageItem = {
      id,
      config,
      lastModified: Date.now(),
    };
    await store.setItem(id, newItem);
    return id;
  };

  const addItem = async (config: ContentConfig) => {
    await load();
    const id = (Date.now() + '' + Math.floor(Math.floor(Math.random() * Date.now()))).substring(
      0,
      24,
    );
    return updateItem(id, config);
  };

  const bulkInsert = async (newProjects: ContentConfig[]) => {
    await load();
    for (const config of newProjects) {
      await addItem(config);
    }
  };

  const deleteItem = async (id: string) => {
    await load();
    await store.removeItem(id);
  };

  const clear = async () => {
    await load();
    await store.clear();
  };

  return {
    getList,
    getAllData,
    getItem,
    addItem,
    updateItem,
    deleteItem,
    bulkInsert,
    clear,
  };
};
