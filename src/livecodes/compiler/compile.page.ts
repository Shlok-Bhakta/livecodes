/* eslint-disable import/no-internal-modules */
import { runOutsideWorker as rescript } from '../languages/lang-rescript';
import { runOutsideWorker as mdx } from '../languages/lang-mdx';
import { runOutsideWorker as graph } from '../languages/lang-graph';

(window as any).compilers = {
  rescript,
  reason: rescript,
  ocaml: rescript,
  mdx,
  graph,
};
