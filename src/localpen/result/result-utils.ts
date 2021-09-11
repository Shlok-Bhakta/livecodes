import { handleEval, handleResize, proxyConsole } from './utils';

proxyConsole();
handleEval();
handleResize();

window.addEventListener('message', function (event) {
  if (event.data.styles) {
    const styles = document.querySelector('#__localpen_styles__');
    if (!styles) return;
    styles.innerHTML = event.data.styles;
  }
  parent.postMessage({ type: 'loading', payload: false }, '*');
});

window.addEventListener('load', () => {
  parent.postMessage({ type: 'loading', payload: false }, '*');
});
