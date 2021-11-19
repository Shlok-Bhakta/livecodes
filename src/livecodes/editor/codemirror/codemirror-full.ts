/* eslint-disable import/no-internal-modules */
import { LanguageSupport } from '@codemirror/language';
import { StreamLanguage, StreamParser } from '@codemirror/stream-parser';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { coffeeScript } from '@codemirror/legacy-modes/mode/coffeescript';
import { liveScript } from '@codemirror/legacy-modes/mode/livescript';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { go } from '@codemirror/legacy-modes/mode/go';
import { perl } from '@codemirror/legacy-modes/mode/perl';
import { lua } from '@codemirror/legacy-modes/mode/lua';
import { scheme } from '@codemirror/legacy-modes/mode/scheme';
import { less } from '@codemirror/legacy-modes/mode/css';
import { stylus } from '@codemirror/legacy-modes/mode/stylus';
import { sql } from '@codemirror/lang-sql';
import { php } from '@codemirror/lang-php';
import { wast } from '@codemirror/lang-wast';

import { CodeEditor, EditorOptions, Language } from '../../models';
import { createEditorCreator } from './codemirror';
import { basicLanguages } from './codemirror-basic';

// TODO: replace with official extension when available
import emmetExt from './emmet-codemirror6-ext';

const legacy = (parser: StreamParser<unknown>) =>
  new LanguageSupport(StreamLanguage.define(parser));

export const fullLanguages: Partial<{ [key in Language]: () => LanguageSupport }> = {
  ...basicLanguages,
  markdown,
  python,
  php,
  sql,
  wat: wast,
  coffeescript: () => legacy(coffeeScript),
  livescript: () => legacy(liveScript),
  ruby: () => legacy(ruby),
  go: () => legacy(go),
  perl: () => legacy(perl),
  lua: () => legacy(lua),
  scheme: () => legacy(scheme),
  less: () => legacy(less),
  stylus: () => legacy(stylus),
};

export const createEditor = async (options: EditorOptions): Promise<CodeEditor> =>
  createEditorCreator(fullLanguages, emmetExt)(options);
