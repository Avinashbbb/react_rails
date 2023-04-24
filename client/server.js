import { createGenerateClassName } from '@material-ui/core';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssProvider from 'react-jss/lib/JssProvider';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { flushChunkNames } from 'react-universal-component/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import flushChunks from 'webpack-flush-chunks';

import App from './components/App';
import stats from './dist/stats.json';
import store from './store';

const context = {};
const sheet = new ServerStyleSheet();
const sheetMui = new SheetsRegistry();
const { __PRELOADED_STATE__ } = global;
const { redux, ...remainingState } = __PRELOADED_STATE__;

const generateClassName = createGenerateClassName();

const ParfaitMenage = (
  <Provider store={store}>
    <JssProvider registry={sheetMui} generateClassName={generateClassName}>
      <StyleSheetManager sheet={sheet.instance}>
        <StaticRouter context={context} location={remainingState.location}>
          <App {...remainingState} />
        </StaticRouter>
      </StyleSheetManager>
    </JssProvider>
  </Provider>
);

const html = renderToString(ParfaitMenage);

const { scripts } = flushChunks(stats, {
  before: ['manifest', 'vendor'],
  chunkNames: flushChunkNames(),
});

global.exports = {
  muiStyles: sheetMui.toString(),
  styles: sheet.getStyleTags(),
  html,
  scripts,
};
