import React, { Component } from "react";
import styled from "styled-components";
import { ProductConsumer } from "../context";
import { throws } from "assert";
import MenuMaterial from "./MenuMaterial.js";
import Product from "./Product";
import StoreLoader from "./StoreLoader";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.ProductRef = React.createRef();
    this.state = {};
    this.psToken = this.psToken;
    this.changeGroupHandler = this.changeGroupHandler.bind(this);
    this.changeGlobalHandler = this.changeGlobalHandler.bind(this);
  }

  changeGroupHandler = newActive => {
    this.props.setStateFrom("activeGroup", newActive);
  };

  changeGlobalHandler = newActive => {
    this.props.setStateFrom("activeModule", newActive);
  };

  componentDidMount() {
    console.log("this.props = ", this.props);

    if (this.props.psToken && !this.props.virtualItems) {
      this.props.setStateFrom("fetching", true);
      StoreLoader(window.xProjectId, this.props.logToken).then(allData => {
        this.props.setCurrs(allData);
      });
    }
  }

  render() {
    return (
      <div>
        <ProductConsumer>
          {valueFromContext => {
            return (
              <div className="">
                <CssStore00
                  style={{
                    // backgroundColor: valueFromContext.theme['colorBg'],
                    backgroundColor: "transparent",
                    color: valueFromContext.theme["colorText"]
                  }}
                >
                  {/*{valueFromContext.virtualItems*/}
                  {/*&& valueFromContext.currency*/}
                  {/*&& valueFromContext.subscriptions*/}
                  {/*&& <CssMenu>*/}

                  {/*<MenuMaterial*/}
                  {/*virtualItems={*/}
                  {/*[{*/}
                  {/*id: 'virtualItems',*/}
                  {/*name: 'Virtual Items',*/}
                  {/*},{*/}
                  {/*id: 'currency',*/}
                  {/*name: 'Currency',*/}
                  {/*},{*/}
                  {/*id: 'subscriptions',*/}
                  {/*name: 'Subscriptions',*/}
                  {/*}]*/}
                  {/*}*/}
                  {/*active="virtualItems"*/}
                  {/*changeGlobalHandler={this.changeGlobalHandler}*/}
                  {/*// changeGroupHandler={this.changeGroupHandler}*/}
                  {/*setStateFrom={valueFromContext.setStateFrom}*/}
                  {/*/>*/}

                  {/*</CssMenu>}*/}

                  {valueFromContext.activeModule === "virtualItems" &&
                    valueFromContext.virtualItems && (
                      <CssProductList>
                        <CssMenu>
                          <MenuMaterial
                            virtualItems={valueFromContext.virtualItems}
                            active="first"
                            // changeGlobalHandler={this.changeGlobalHandler}
                            changeGroupHandler={this.changeGroupHandler}
                            setStateFrom={valueFromContext.setStateFrom}
                          />
                        </CssMenu>

                        {valueFromContext.activeModule === "virtualItems" &&
                          valueFromContext.virtualItems.map((oneGroup, key) => {
                            if (
                              (this.props.activeGroup === "first" &&
                                key === 0) ||
                              this.props.activeGroup === "all" ||
                              this.props.activeGroup === oneGroup["id"] ||
                              this.props.activeGroup === oneGroup["name"]
                            ) {
                              return (
                                <div key={this.ProductRef}>
                                  <СssTitle
                                    getTheme={valueFromContext.getTheme.bind(
                                      this
                                    )}
                                  >
                                    {oneGroup.name}
                                  </СssTitle>
                                  <СssGroup>
                                    {oneGroup.products &&
                                      oneGroup.products.map(
                                        (oneProduct, key) => {
                                          return (
                                            <Product
                                              ref={this.ProductRef}
                                              key={oneProduct.id}
                                              order={key}
                                              initClass="initialFlow1"
                                              sku={oneProduct.sku}
                                              title={oneProduct.name}
                                              description={
                                                oneProduct.description
                                              }
                                              price={oneProduct.amount}
                                              image_url={oneProduct.image_url}
                                              currency={oneProduct.currency}
                                              product={oneProduct}
                                              addToCart={
                                                valueFromContext.addToCart
                                              }
                                              getTheme={valueFromContext.getTheme.bind(
                                                this
                                              )}
                                            />
                                          );
                                        }
                                      )}
                                  </СssGroup>
                                </div>
                              );
                            }
                          })}
                      </CssProductList>
                    )}

                  {valueFromContext.activeModule === "subscriptions" &&
                    valueFromContext.subscriptions && (
                      <CssProductList>
                        <СssTitle
                          getTheme={valueFromContext.getTheme.bind(this)}
                        >
                          Subscriptions
                        </СssTitle>
                        <СssGroup>
                          {valueFromContext.subscriptions["packages"].map(
                            (oneSubscr, key) => {
                              return (
                                <div key={"key" + oneSubscr["id"]}>
                                  <Product
                                    ref={this.ProductRef}
                                    key={key}
                                    order={key}
                                    initClass="initialFlow1"
                                    sku={key}
                                    title={oneSubscr.name}
                                    description={oneSubscr.description}
                                    price={oneSubscr.charge_amount}
                                    image_url="https://cdn.xsolla.net/img/misc/images/49a8c22603d1f89b69c0fa290d99e8fa.png"
                                    currency={oneSubscr.currency}
                                  />
                                </div>
                              );
                            }
                          )}
                        </СssGroup>
                      </CssProductList>
                    )}

                  {valueFromContext.activeModule === "currency" &&
                    valueFromContext.currency && (
                      <CssProductList>
                        <СssTitle
                          getTheme={valueFromContext.getTheme.bind(this)}
                        >
                          Virtual Currency
                        </СssTitle>
                        <СssGroup>
                          {valueFromContext.currency["list"].map(
                            (oneCurr, i) => {
                              return (
                                <div key={"curr" + i}>
                                  <Product
                                    ref={this.ProductRef}
                                    key={i}
                                    order={i}
                                    initClass="initialFlow1"
                                    sku={i}
                                    title={oneCurr.label}
                                    description={oneCurr.description}
                                    image_url={oneCurr.image}
                                    price={oneCurr.sum}
                                    currency={oneCurr.currency}
                                  />
                                </div>
                              );
                            }
                          )}
                        </СssGroup>
                      </CssProductList>
                    )}
                </CssStore00>

                <CssGlobalBg
                  backgroundUrl={valueFromContext.getTheme("backgroundUrl")}
                >
                  <CssGlobalTint
                    colorBg={valueFromContext.getTheme("colorBg")}
                  />
                </CssGlobalBg>
              </div>
            );
          }}
        </ProductConsumer>
      </div>
    );
  }
}

const CssGlobalBg = styled.div`
  background-image: url(${props => props.backgroundUrl});
  z-index: 0;
  background-size: cover;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
const CssGlobalTint = styled.div`
  background-color: ${props => props.colorBg};
  opacity: 0.8;
  z-index: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

const CssStore00 = styled.div`
  position: relative;
  z-index: 4;
`;
const CssProductList = styled.div`
  /* position: relative;
  z-index: 4; */
`;

const CssMenu = styled.div`
  /* display: flex; */
  align-items: center;
  flex-grow: 1;
  margin: 24px 0;
`;

const СssGroup = styled.div`
  /* width: '100%'; */
  display: flex;
  flex-wrap: wrap;
  /* align-items: center; */
  /* justify-content: center; */
  /* align-items: center; */
  /* justify-content: center; */
  /* display: grid; */
  /* grid-template-columns: repeat( auto-fit, minmax(260px, 320px)); */
  /* grid-row-gap: 24px; */
  place-content: center;
`;

const СssTitle = styled.div`
  color: ${props => props.getTheme("colorText")};
  padding-top: 2em;
  min-height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export default ProductList;
