import { LanguageSpecs } from '../models';
import { requireUrl, vendorsBaseUrl } from '../vendors';

const cdnBaselUrl = vendorsBaseUrl + 'wacl/';

export const tcl: LanguageSpecs = {
  name: 'tcl',
  title: 'Tcl',
  compiler: {
    factory: () => async (code) => code,
    scripts: [requireUrl],
    scriptType: 'text/tcl',
    compiledCodeLanguage: 'tcl',
    inlineScript: `
livecodes.tcl = livecodes.tcl || {};
livecodes.tcl.run = livecodes.tcl.run || ((input) => new Promise(async (resolve) => {
  livecodes.tcl.input = input;
  livecodes.tcl.output = null;

  const runCode = async (code, input, interp) => {
    const originalPrompt = window.prompt;
    window.prompt = () => input;
    let output = null;
    let error = null;
    interp.stdout = val => {output = (output ?? '') + val + '\\n'};
    interp.stderr = val => {error = (error ?? '') + val + '\\n'};
    const value = interp.Eval(code);
    output = (output ?? '') + value;
    window.prompt = originalPrompt;
    return {output, error};
  };

  let code = '';
  const scripts = document.querySelectorAll('script[type="text/tcl"]');
  scripts.forEach(script => code += script.innerHTML + '\\n');

  const interpreter = await livecodes.tcl.loaded;
  const result = await runCode(code, input, interpreter);

  if (result.error != null) {
    console.error(result.error);
  } else if (result.output != null) {
    console.log(result.output);
  }
  livecodes.tcl.input = input;
  livecodes.tcl.output = result.output;
  livecodes.tcl.error = result.error;
  livecodes.tcl.ready = true;
  resolve(result);
}));
livecodes.tcl.loaded = new Promise(resolve => {
  requirejs.config({ baseUrl: '${cdnBaselUrl}' });
  require(["tcl/wacl"], (wacl) => {
    wacl.onReady((interp) => {
      resolve(interp);
    });
  });
});
window.addEventListener('load', async () => {
  parent.postMessage({ type: 'loading', payload: true }, '*');
  livecodes.tcl.ready = false;
  await livecodes.tcl.run(livecodes.tcl.input);
  parent.postMessage({ type: 'loading', payload: false }, '*');
});
`,
  },
  extensions: ['tcl'],
  editor: 'script',
};
