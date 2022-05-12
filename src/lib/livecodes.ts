import type { API, Code, Config, ChangeHandler } from './models';

export type { Code, Config };

export interface Playground extends API {
  load: () => Promise<void>;
}

export interface EmbedOptions {
  appUrl?: string;
  config?: Partial<Config> | string;
  importUrl?: string;
  loading?: 'scroll' | 'click' | 'eager';
  template?: string;
}

export const createPlayground = async (
  container: string | HTMLElement,
  options: EmbedOptions = {},
): Promise<Playground> => {
  const {
    config = {},
    template,
    importUrl,
    appUrl = 'https://livecodes.io/',
    loading = 'scroll',
  } = options;

  let containerElement: HTMLElement | null;
  if (typeof container === 'string') {
    containerElement = document.querySelector(container);
  } else {
    containerElement = container;
  }
  if (!container) {
    throw new Error('Container element is required.');
  }
  if (!containerElement) {
    throw new Error(`Cannot find element: "${container}"`);
  }

  let url: URL;
  try {
    url = new URL(appUrl);
  } catch {
    throw new Error(`"${appUrl}" is not a valid URL.`);
  }

  const origin = url.origin;

  if (typeof config === 'string') {
    url.searchParams.set('config', config);
  } else if (typeof config === 'object' && Object.keys(config).length > 0) {
    try {
      const encoded = btoa(JSON.stringify(config));
      for (const [key, value] of Object.entries(config)) {
        if (['string', 'boolean', 'number', 'undefined'].includes(typeof value)) {
          url.searchParams.set(key, String(value));
        }
      }
      url.searchParams.set('config', 'data:application/json;base64,' + encoded);
    } catch {
      throw new Error('Invalid configuration object.');
    }
  }

  if (template) {
    url.searchParams.set('template', template);
  }

  if (importUrl) {
    url.searchParams.set('x', importUrl);
  }

  url.searchParams.set('embed', 'true');
  if (loading === 'eager') {
    url.searchParams.set('click-to-load', 'false');
  }

  let livecodesReady = false;
  let destroyed = false;
  const alreadyDestroyedMessage = 'Cannot call API methods after calling `destroy()`.';
  const createIframe = () =>
    new Promise<HTMLIFrameElement>((resolve) => {
      if (!containerElement) return;

      const frame = document.createElement('iframe');
      frame.setAttribute(
        'sandbox',
        'allow-same-origin allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-presentation allow-scripts',
      );
      const iframeLoading = loading === 'eager' ? 'eager' : 'lazy';
      frame.setAttribute('loading', iframeLoading);
      frame.classList.add('livecodes');
      frame.src = url.href;
      frame.onload = () => {
        addEventListener('message', function readyHandler(e) {
          if (e.source !== frame.contentWindow || e.origin !== origin) return;
          if (e.data.type === 'livecodes-ready') {
            removeEventListener('message', readyHandler);
            livecodesReady = true;
          }
        });
        resolve(frame);
      };
      containerElement.appendChild(frame);
    });

  const iframe = await createIframe();

  const callAPI = <T>(method: keyof API, args?: any[]) =>
    new Promise<T>(async (resolve, reject) => {
      if (destroyed) {
        return reject(alreadyDestroyedMessage);
      }
      if (!livecodesReady) {
        await loadLivecodes();
      }
      addEventListener('message', function handler(e) {
        if (
          e.source !== iframe.contentWindow ||
          e.origin !== origin ||
          e.data?.type !== 'api-response'
        ) {
          return;
        }

        if (e.data.method === method) {
          removeEventListener('message', handler);
          const payload = e.data.payload;
          if (payload?.error) {
            reject(payload.error);
          } else {
            resolve(payload);
          }
        }
      });
      iframe.contentWindow?.postMessage({ method, args }, origin);
    });

  const delay = (duration = 100) =>
    new Promise((resolve) => {
      setTimeout(resolve, duration);
    });

  const loadLivecodes = (): Promise<void> =>
    destroyed
      ? Promise.reject(alreadyDestroyedMessage)
      : new Promise(async (resolve) => {
          iframe.contentWindow?.postMessage({ type: 'livecodes-load' }, origin);
          while (!livecodesReady) {
            await delay();
          }
          resolve();
        });

  let watchers: ChangeHandler[] = [];
  const onChange = (fn: ChangeHandler) => {
    if (destroyed) {
      throw new Error(alreadyDestroyedMessage);
    }
    watchers.push(fn);
    return {
      remove: () => {
        watchers = watchers.filter((w) => w !== fn);
      },
    };
  };
  addEventListener('message', async (e: MessageEvent) => {
    if (
      e.source !== iframe.contentWindow ||
      e.origin !== origin ||
      e.data?.type !== 'livecodes-change'
    ) {
      return;
    }
    const code = await callAPI<Code>('getCode');
    const config = await callAPI<Config>('getConfig');

    watchers.forEach((fn) => {
      fn({ code, config });
    });
  });

  const destroy = () => {
    watchers.length = 0;
    if (containerElement) {
      containerElement.innerHTML = '';
    }
    destroyed = true;
  };

  if (loading === 'scroll' && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            await loadLivecodes();
            observer.unobserve(containerElement!);
          }
        });
      },
      { rootMargin: '150px' },
    );
    observer.observe(containerElement);
  }

  return {
    load: () => loadLivecodes(),
    run: () => callAPI('run'),
    format: (allEditors) => callAPI('format', [allEditors]),
    getShareUrl: (shortUrl) => callAPI('getShareUrl', [shortUrl]),
    getConfig: (contentOnly) => callAPI('getConfig', [contentOnly]),
    setConfig: (config: Config) => callAPI('setConfig', [config]),
    getCode: () => callAPI('getCode'),
    show: (pane, full) => callAPI('show', [pane, full]),
    runTests: () => callAPI('runTests'),
    onChange: (fn) => onChange(fn),
    destroy: () => {
      if (!livecodesReady) {
        if (destroyed) {
          return Promise.reject(alreadyDestroyedMessage);
        }
        destroy();
        return Promise.resolve();
      }
      return callAPI('destroy').then(destroy);
    },
  };
};
