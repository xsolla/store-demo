import React, { Component } from "react";
import {HashRouter, Route} from 'react-router-dom';
import styled from "styled-components";

import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import {InventoryList} from './features/inventory/InventoryList';
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import Preloader from "./components/Preloader.js";
import { ProductConsumer } from "./context";

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <ProductConsumer>
          {valueFromContext => {
            return (
              <React.Fragment>
                <div className="">
                  <Navbar showCart={valueFromContext.showCart} />
                  <div>
                    <CssStore0>
                      <CssCart />
                      <Route path="/" exact render={() => (!valueFromContext.fetching && <ProductList {...valueFromContext} />)} />
                      <Route path="/inventory" render={() => (!valueFromContext.fetching && <InventoryList {...valueFromContext} />)} />
                      {valueFromContext.fetching && <Preloader />}
                    </CssStore0>
                  </div>
                </div>

                <div className="global-background">
                  <div className="global-background-tint" />
                </div>
              </React.Fragment>
            );
          }}
        </ProductConsumer>
      </HashRouter>
    );
  }
}

const CssStore0 = styled.div`
  overflow-y: auto;
  z-index: 1;
`;

const CssCart = styled(Cart)`
  left: 0;
  top: 0;
  height: 100vh;
  display: grid;
  align-items: center;
  position: relative;
  z-index: 100;
`;

export default App;
