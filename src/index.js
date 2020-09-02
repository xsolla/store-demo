import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter} from 'react-router-dom';
import {Provider as ReduxProvider} from 'react-redux';

import './index.css';
import App from './App';
import Provider from './provider';
import {combineReducers, createStore} from 'redux';
import {RedeemModalReducer} from './redux/reducer/redeem-modal-reducer'
import {RedeemFormReducer} from './redux/reducer/redeem-form-reducer'

const reduxStore = createStore(
  combineReducers({
    redeem_modal: RedeemModalReducer,
    redeem_form: RedeemFormReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
  <HashRouter basename="/">
      <ReduxProvider store={reduxStore}>
        <Provider reduxStore={reduxStore}>
          <App/>
        </Provider>
      </ReduxProvider>
  </HashRouter>,
  document.getElementById('root')
);
