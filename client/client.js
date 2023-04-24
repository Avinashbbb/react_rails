import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import store from './store';

const { __PRELOADED_STATE__ } = global;
const { redux, ...remainingState } = __PRELOADED_STATE__;

const ParfaitMenage = (
  <Provider store={store}>
    <BrowserRouter>
      <App {...remainingState} />
    </BrowserRouter>
  </Provider>
);

hydrate(
  ParfaitMenage,
  document.getElementById('app'), // eslint-disable-line no-undef
);

