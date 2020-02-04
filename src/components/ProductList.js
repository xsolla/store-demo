import React, { Component } from "react";
import styled from "styled-components";

import { ProductConsumer } from "../context";
import MenuMaterial from "./MenuMaterial.js";
import ProductCard from "./ProductCard";
import StoreLoader from "./StoreLoader";

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeGroupHandler = newActive => {
    this.props.setStateFrom("activeGroup", newActive);
  };

  componentDidMount() {
    if (this.props.logToken && !this.props.virtualItems) {
      this.props.setStateFrom("fetching", true);
      StoreLoader(window.xProjectId, this.props.logToken).then(allData => {
        this.props.setCurrs(allData);
      });

      this.props.updateVirtualCurrencyBalance();
    }
  }

  render() {
    const { activeGroup } = this.props;

    return (
      <div>
        <ProductConsumer>
          {valueFromContext => (
            <CssStore00
              style={{
                backgroundColor: "transparent",
                color: valueFromContext.theme["colorText"]
              }}
            >
              {valueFromContext.activeModule === "virtualItems" &&
              valueFromContext.virtualItems && (
                <div>
                  <CssMenu>
                    <MenuMaterial
                      virtualItems={valueFromContext.virtualItems}
                      activeGroup={valueFromContext.activeGroup}
                      changeGroupHandler={this.changeGroupHandler}
                    />
                  </CssMenu>

                  {valueFromContext.activeModule === "virtualItems" &&
                  valueFromContext.virtualItems.map((group, key) => {
                    if (
                      (activeGroup === "first" && key === 0) ||
                      activeGroup === "all" ||
                      activeGroup === group["id"] ||
                      activeGroup === group["name"]
                    ) {
                      return (
                        <div key={group.name}>
                          <СssTitle getTheme={valueFromContext.getTheme}>
                            {group.name}
                          </СssTitle>
                          <СssGroup>
                            {group.products && group.products.map((product, key) => (
                              <ProductCard
                                key={product.sku}
                                order={key}
                                product={product}
                                addToCart={valueFromContext.addToCart}
                                getTheme={valueFromContext.getTheme}
                                buyByVC={valueFromContext.buyByVC}
                              />
                            ))}
                          </СssGroup>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </CssStore00>
          )}
        </ProductConsumer>
      </div>
    );
  }
}

const CssStore00 = styled.div`
  position: relative;
  z-index: 4;
`;

const CssMenu = styled.div`
  flex-grow: 1;
  margin: 24px 0;
`;

const СssGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
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
