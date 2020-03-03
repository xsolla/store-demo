import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import Provider from './provider';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <HashRouter basename='/'>
    <Provider>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById('root')
);

serviceWorker.unregister();
