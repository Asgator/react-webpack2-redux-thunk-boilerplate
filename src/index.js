import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Routes from 'routes';

import store from 'store/configure-store';

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
  document.getElementById('root')
);
