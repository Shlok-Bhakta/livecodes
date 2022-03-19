// @ts-check
/* eslint-disable import/no-internal-modules */
/* eslint-disable @typescript-eslint/no-var-requires */

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LiveCodes',
  tagline: 'Code playground that runs in the browser!',
  url: 'https://livecodes.io/',
  baseUrl: '/web/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'LiveCodes',
  projectName: 'LiveCodes',
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/live-codes/livecodes/tree/develop/web/',
        },
        blog: false,
        // {
        //   showReadingTime: true,
        //   editUrl: 'https://github.com/live-codes/livecodes/tree/develop/web/',
        // },
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('react-responsive-carousel/lib/styles/carousel.min.css'),
          ],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
      },
      navbar: {
        title: 'LiveCodes',
        logo: {
          alt: 'LiveCodes Logo',
          src: 'img/livecodes-logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'doc',
            docId: 'examples/display-modes/index',
            position: 'left',
            label: 'Examples',
          },
          // { to: '/web/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://livecodes.io/',
            label: 'Playground',
            position: 'right',
          },
          {
            href: 'https://github.com/live-codes/livecodes',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      hideableSidebar: true,
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Overview',
                to: '/web/docs',
              },
              {
                label: 'Getting Started',
                to: '/web/docs/getting-started',
              },
              {
                label: 'Why Another Playground?',
                to: '/web/docs/why',
              },
              {
                label: 'Features',
                to: '/web/docs/features',
              },
              {
                label: 'Languages',
                to: '/web/docs/languages',
              },
            ],
          },
          {
            title: 'App',
            items: [
              {
                label: 'Home',
                href: 'https://livecodes.io',
              },
              {
                label: 'Starter Templates',
                href: 'https://livecodes.io/?screen=new',
              },
            ],
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/web/blog',
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/live-codes/livecodes',
              },
              {
                label: 'Credits',
                to: '/web/docs/credits',
              },
              {
                label: 'License',
                to: '/web/docs/license',
              },
              {
                label: 'Sponsor',
                to: '/web/docs/sponsor',
              },
              {
                label: 'About',
                to: '/web/docs/about',
              },
            ],
          },
        ],
        copyright: `<br /> Released under the MIT License <br />
        Copyright © ${new Date().getFullYear()}
        <a href="https://github.com/hatemhosny" target="_blank" rel="noopener noreferrer">Hatem Hosny</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  scripts: [
    {
      src: 'https://cdn.jsdelivr.net/npm/prettier@2.4.1/standalone.min.js',
      async: true,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/prettier@2.4.1/parser-babel.js',
      async: true,
    },
  ],
};

module.exports = config;
