//https://docs.google.com/document/d/1bPm1r5RUWBtPLAlJ4A08FFFVHAYK7UefSiGkosFw5yk/edit#

import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import styled from "styled-components";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";

import Details from "./components/Details";
import Cart from "./components/Cart";
import Default from "./components/Default";
import ProductList from "./components/ProductList";

import StoreSb0 from "./sb/StoreSb0";

import Preloader from "./components/Preloader.js";

import { ProductConsumer } from "./context";

class App extends Component {
  state = {
    // psToken: 'k8pnptVIVZCTs7EMFDcRIrwX3CRpdA4q', //null
    psToken: null
  };

  componentWillUpdate(nextProps, nextState) {
    console.log("nextState.psToken = ", nextState.psToken);
  }

  render() {
    return (
      <ProductConsumer>
        {valueFromContext => {
          return (
            <React.Fragment>
              <div className="">
                <Navbar />
                <div
                  style={{
                    backgroundColor: valueFromContext.getTheme("colorBg"),
                    minHeight: "100vh",
                    fontFamily: valueFromContext.getTheme("fontFamily"),
                    display: "grid",
                    gridTemplateColumns: "280px minmax(600px, 100%)",
                    height: "100vh"
                  }}
                >
                  <CssSb0>
                    <StoreSb0 />
                  </CssSb0>

                  <CssStore0>
                    <CssCart />
                    <Switch>
                      <Route exact path="/" />
                      <Route path="/details" component={Details} />
                      {/* <Route path="/cart" component={Cart} /> */}
                      <Route component={Default} />
                    </Switch>

                    {valueFromContext.psToken ? (
                      <ProductList {...valueFromContext} />
                    ) : (
                      ""
                    )}
                    {valueFromContext.fetching && <Preloader />}
                  </CssStore0>
                </div>
              </div>
            </React.Fragment>
          );
        }}

        {/* <ProductList psToken='k8pnptVIVZCTs7EMFDcRIrwX3CRpdA4q' /> */}
      </ProductConsumer>
    );
  }
}

const CssStore0 = styled.div`
  /* background-color: #506373; */

  /* display: flex; */
  /* align-items: center; */
  height: 100vh;
  overflow-y: auto;
  /* position: relative; */
  z-index: 1;
`;

const CssCart = styled(Cart)`
  /* background-color: #506373; */
  left: 0;
  top: 0;
  height: 100vh;
  display: grid;
  align-items: center;
  position: relative;
  z-index: 100;
`;

const CssSb0 = styled.div`
  background-color: #506373;
  color: #506373;
  height: 100vh;
  display: flex;
  /* align-items: center; */
  position: relative;
  z-index: 2;
`;

export default App;
