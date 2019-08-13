import React from "react";
import Product from "./Product";
import styled from "styled-components";
import { relative } from "path";

const propTypes = {};

const defaultProps = {};

export default function Group({}) {
  return (
    <div>
      <СssTitle
      // getTheme={fromContext.getTheme.bind(this)}
      >
        {this.props.name}
      </СssTitle>
      <СssGroup>
        {this.props.products &&
          this.props.products.map((oneProduct, key) => {
            return (
              <Product
                // ref={this.ProductRef}
                key={oneProduct.id}
                order={key}
                initClass="initialFlow1"
                sku={oneProduct.sku}
                title={oneProduct.name}
                description={oneProduct.description}
                price={oneProduct.amount}
                image_url={oneProduct.image_url}
                currency={oneProduct.currency}
              />
            );
          })}
      </СssGroup>
    </div>
  );
}

const СssGroup = styled.div`
  width: "100%";
  display: flex;
  /* align-items: center; */
  /* justify-content: center; */
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const СssTitle = styled.div`
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

Group.propTypes = propTypes;
Group.defaultProps = defaultProps;
