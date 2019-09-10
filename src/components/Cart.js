import React from "react";
import styled from "styled-components";
import Product from "./Product";
import IconClose from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Colorer from "color";
import { getFormattedCurrency } from "./formatCurrency";

import { ProductContext } from "../context";
import { getPsTokenBuyCart } from "./StoreLoader";

function Cart({ style = {} }) {
  let [buyButtonDisabled, setBuyButtonDisabled] = React.useState(false);

  const valueFromContext = React.useContext(ProductContext);

  const hideCart = () => {
    valueFromContext.setStateFrom("cartShown", false);
  };

  const calculateSubtotal = cart => {
    let subtotal = 0;
    cart.forEach(function(element) {
      subtotal += element.price.amount * element.quantity;
    });
    return Math.round(subtotal * 100) / 100;
  };

  const buyButtonAction = () => {
    setBuyButtonDisabled(true);
    let psTokenPromise = getPsTokenBuyCart(
      valueFromContext.cart.cartId,
      valueFromContext.logToken
    );
    psTokenPromise
      .then(response => {
        window.xPayStationInit(response.data["token"]);
        window.XPayStationWidget.open();
        window.XPayStationWidget.on(
          window.XPayStationWidget.eventTypes.CLOSE,
          (event, data) => {
            setBuyButtonDisabled(false);
          }
        );
        window.XPayStationWidget.on(
          window.XPayStationWidget.eventTypes.STATUS_DONE,
          (event, data) => valueFromContext.payStationHandler(event, data)
        );
      })
      .catch(e => {});
  };

  return (
    <div>
      {valueFromContext.cartShown && (
        <Cart0>
          <CartB
            style={{
              padding: "0 32px 0 32px",
              borderRadius: valueFromContext.getTheme("borderRadius"),
              backgroundColor: valueFromContext.getTheme("colorBg"),
              color: valueFromContext.getTheme("colorText")
            }}
          >
            <div
              style={{
                backgroundColor: valueFromContext.getTheme("colorBg"),
                color: valueFromContext.getTheme("colorText")
              }}
            >
              <CssCartH
                style={{
                  backgroundColor: `${valueFromContext.getTheme("colorBg")}`,
                  // borderBottom: `1px solid ${valueFromContext.getTheme("colorText")}`
                  borderBottom: `1px solid ${Colorer(
                    valueFromContext.getTheme("colorText")
                  )
                    .alpha(0.1)
                    .string()}`
                }}
              >
                <h4>Cart {}</h4>
                <IconClose
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={e => hideCart(e)}
                />
              </CssCartH>

              <CssCartList>
                {valueFromContext.cart &&
                  valueFromContext.cart.items.map((oneCartItem, i) => {
                    return (
                      <div key={`cartitem${i}`}>
                        <Product
                          product={oneCartItem}
                          key={oneCartItem.sku}
                          order={i}
                          initClass="initialFlow1"
                          sku={oneCartItem.sku}
                          title={oneCartItem.name}
                          description={oneCartItem.description}
                          price={oneCartItem.price.amount}
                          image_url={oneCartItem.image_url}
                          currency={oneCartItem.price.currency}
                          cardType="cart"
                          cartId={valueFromContext.cart.cartId}
                          logToken={valueFromContext.logToken}
                          removeFromCart={valueFromContext.removeFromCart}
                          changeItemQuantityInCart={
                            valueFromContext.changeItemQuantityInCart
                          }
                          quantity={oneCartItem.quantity}
                        />
                      </div>
                    );
                  })}
                {valueFromContext.cart &&
                  valueFromContext.cart.items.length <= 0 && <p>Empty cart</p>}
              </CssCartList>

              <CssCartB
                style={{
                  backgroundColor: `${valueFromContext.getTheme("colorBg")}`,
                  // borderTop: `1px solid ${valueFromContext.getTheme("colorText")}`
                  borderTop: `1px solid ${Colorer(
                    valueFromContext.getTheme("colorText")
                  )
                    .alpha(0.1)
                    .string()}`
                }}
              >
                <div className="" />
                {valueFromContext.cart &&
                  valueFromContext.cart.items.length > 0 && (
                    <CssSubtotal>
                      Subtotal:
                      <div
                        style={{
                          minWidth: 80,
                          textAlign: "right"
                        }}
                      >
                        {valueFromContext.isFetching &&
                          getFormattedCurrency(
                            calculateSubtotal(valueFromContext.cart.items),
                            valueFromContext.cart.items[0].price.currency
                          ).formattedCurrency}
                        {!valueFromContext.isFetching &&
                          getFormattedCurrency(
                            valueFromContext.cart.price.amount,
                            valueFromContext.cart.price.currency
                          ).formattedCurrency}
                      </div>
                    </CssSubtotal>
                  )}
                <Button
                  variant="contained"
                  onClick={() => {
                    !(
                      buyButtonDisabled ||
                      valueFromContext.cart.items.length <= 0
                    ) && buyButtonAction();
                  }}
                >
                  Check out
                </Button>
              </CssCartB>
            </div>
          </CartB>
          {/* <Link to='/'> */}
          <CartZ onClick={e => hideCart(e)} />
          {/* </Link> */}
        </Cart0>
      )}
    </div>
  );
}

const CssCartList = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  padding-top: 16px;
  /* justify-content: center; */
  /* align-items: center; */
  /* position: fixed; */
  /* left: 0; */
  /* right: 0; */
  /* top: 0; */
  /* bottom: 0; */
  /* z-index: 1; */
`;

const Cart0 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
`;

const CartB = styled.div`
  flex: 1;
  position: absolute;
  max-width: 680px;
  z-index: 1;
  max-height: 80vh;
  overflow-y: auto;
  padding-top: 64px;
`;

const CartZ = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 0;
`;

const CssCartH = styled.div`
  /* background-color: rgba(0,0,0,0.8); */
  position: sticky;
  top: 0;
  z-index: 0;
  /* height: 64px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
  padding: 24px 0 8px 0;
`;

const CssCartB = styled.div`
  /* background-color: rgba(0,0,0,0.8); */
  position: sticky;
  bottom: 0;
  z-index: 0;
  /* height: 64px; */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 10;
  padding: 24px 0 24px 0;
`;

const CssSubtotal = styled.div`
  display: flex;
  padding: 0 24px 0 24px;
  font-weight: bold;
`;

export default Cart;
