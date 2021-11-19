import { appHTML } from './html';
import { API, Config } from './models';

export { API, Config };
export const livecodes = async (
  container: string,
  config: Partial<Config> = {},
  isEmbed = false,
): Promise<API> =>
  new Promise(async (resolve) => {
    const containerElement = document.querySelector(container);
    if (!containerElement) {
      throw new Error(`Cannot find element with the selector: "${container}"`);
    }
    const baseUrl = import.meta.url.split('/').slice(0, -1).join('/') + '/';

    const style = document.createElement('style');
    style.innerHTML = `
        ${container} {
            min-width: 300px;
            min-height: 200px;
            padding: 0;
            overflow: hidden;
        }
        ${container} > iframe {
            border: 0;
            width: 100%;
            height: 100%;
        }
        ${container}.embed iframe {
            width: calc(100% - 2px);
            height: calc(100% - 2px);
            border: 1px solid #001b25;
            border-radius: 5px;
        }
    `;
    document.head.appendChild(style);

    const iframe = document.createElement('iframe');
    iframe.name = 'app';
    iframe.style.display = 'none';

    containerElement.appendChild(iframe);
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(
      appHTML
        .replace(/{{baseUrl}}/g, baseUrl)
        .replace(/{{script}}/g, isEmbed ? 'embed.js' : 'app.js'),
    );
    iframe.contentWindow?.document.close();

    iframe.addEventListener('load', async () => {
      const app = (iframe.contentWindow as any)?.app;
      if (typeof app === 'function') {
        const api: API = await app(config, baseUrl);
        iframe.style.display = 'block';

        // eslint-disable-next-line no-underscore-dangle
        const callback = (window as any).__livecodesReady;
        if (typeof callback === 'function') {
          callback(api);
        }

        resolve(api);
      }
    });
  });
