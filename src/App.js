import React, { Component } from "react";
import {HashRouter, Route} from 'react-router-dom';
import styled from "styled-components";

import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import {InventoryList} from './features/inventory/InventoryList';
import {PhysicalList} from './features/physical/PhysicalList';
import {ManageInventory} from './features/manage/ManageInventory';
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import Preloader from "./components/Preloader.js";
import { ProductConsumer } from "./context";
import VCPackagesList from "./components/VCPackagesList";
import {EntitlementList} from "./features/entitlement/EntitlementList";
import Alert from "react-bootstrap/Alert";
import {ServerPurchase} from "./features/serverPurchase/ServerPurchase";

class App extends Component {
  render() {
    return (
      <HashRouter basename='/'>
        <ProductConsumer>
          {valueFromContext => {
            return (
              <React.Fragment>
                  {
                      valueFromContext.showCartError
                      &&
                      <Alert onClose={valueFromContext.hideCartError} className={"application-alert"} variant="danger" dismissible>
                          <Alert.Heading>{valueFromContext.cartError.title}</Alert.Heading>
                          <p>{valueFromContext.cartError.message}</p>
                      </Alert>
                  }
                <div className="">
                  <Navbar showCart={valueFromContext.showCart} />
                  <div>
                    <CssStore0>
                      <CssCart />
                      <Route path="/" exact render={() => (!valueFromContext.fetching && <ProductList {...valueFromContext} />)} />
                      <Route path="/inventory" render={() => (!valueFromContext.fetching && <InventoryList {...valueFromContext} />)} />
                      <Route path="/crystals" render={() => (!valueFromContext.fetching && <VCPackagesList {...valueFromContext} />)} />
                      <Route path="/physical" render={() => (!valueFromContext.fetching && <PhysicalList {...valueFromContext} />)} />
                      <Route path="/entitlement" render={() => (!valueFromContext.fetching && <EntitlementList {...valueFromContext} />)} />
                      <Route path="/manage" render={() => (!valueFromContext.fetching && <ManageInventory {...valueFromContext} />)} />
                      <Route path="/purchase" render={() => (!valueFromContext.fetching && <ServerPurchase {...valueFromContext} />)} />
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
