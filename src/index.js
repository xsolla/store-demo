import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ProductProvider } from "./context";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <ProductProvider projectId={window.xProjectId}>
    <App />
  </ProductProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
