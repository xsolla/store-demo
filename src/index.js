import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ProductProvider } from "./context";
import * as serviceWorker from "./serviceWorker";

// import XL from './bower_components/xsolla-login-js-sdk/src/main.js';

// export const ProjectId = 36816; //XSPLIT
// export const ProjectId = window.xProjectId;
export const ProjectId = window.xProjectId; //xsolla store

ReactDOM.render(
  <ProductProvider>
    <Router>
      <App />
    </Router>
  </ProductProvider>,
  document.getElementById("root")
);

// const Data = fetch(dataUrl)
//   .then((response) => {
//     response = response.json();

// ReactDOM.render(
//   <ProductProvider products={response}>
//     <Router>
//       <App />
//     </Router>
//   </ProductProvider>
//   , document.getElementById('root'));

//   });

// function getData() {
//   return fetch(dataUrl).then(function(response) {
//     response = response.json()
//     data = response;
//     return response;
//   })
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
