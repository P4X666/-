import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import store from './models';
import App from './app';

render(
  <Provider {...store}>
    <App />
  </Provider>,
  document.querySelector('#app'),
);
