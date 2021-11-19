import { Template } from '../../models';

export const preactStarter: Template = {
  name: 'preact',
  title: 'Preact Starter',
  thumbnail: 'assets/templates/preact.svg',
  activeEditor: 'script',
  markup: {
    language: 'html',
    content: '<div id="app"></div>\n',
  },
  style: {
    language: 'css',
    content: `
.container,
.container button {
  text-align: center;
  font: 1em sans-serif;
}
.logo {
  width: 150px;
}
`.trimStart(),
  },
  script: {
    language: 'javascript',
    content: `
import { h, Component, render } from "preact";
import { useState } from "preact/hooks";
import htm from "htm";

const html = htm.bind(h);

function App(props) {
  const [counter, setCounter] = useState(0);
  return html\`
  <div class="container">
    <h1>Hello, \${props.name}!</h1>
    <img className="logo" src="{{ __livecodes_baseUrl__ }}assets/templates/preact.svg" />
    <p>You clicked \${counter} times.</p>
    <button onClick=\${() => setCounter(counter + 1)}>Click me</button>
  </div>
  \`;
}

render(html\`<\${App} name="Preact" />\`, document.querySelector("#app"));
`.trimStart(),
  },
  stylesheets: [],
  scripts: [],
  cssPreset: '',
  imports: {},
  types: {},
};
