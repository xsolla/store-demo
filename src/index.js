import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { ProductProvider } from './context';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <ProductProvider projectId={window.xProjectId}>
    <HashRouter basename='/'>
      <App />
    </HashRouter>
  </ProductProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
