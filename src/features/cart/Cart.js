import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Colorer from 'color';
import MUIIconClose from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import MUIModal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';

import Product from '../../components/Product';
import { ProductContext } from '../../context';
import { getFormattedCurrency } from '../../components/formatCurrency';
import { getPsTokenBuyCart, quickPurchaseBuyVirtualCurrency } from '../../components/StoreLoader';
import { device } from '../../styles/devices';
import Preloader from '../../components/Preloader';
import { CartItem } from './CartItem';

const CartComponent = ({ history }) => {
  const [buyButtonDisabled, setBuyButtonDisabled] = React.useState(false);
  const {
    cart,
    hideCart,
    logToken,
    payStationHandler,
    cartShown,
    cartWithItemsBuyingByVC,
    clearVCCart,
    getTheme,
    removeFromCart,
    updateVirtualCurrencyBalance,
    cartWithItemsBuyingByVCShown,
    changeItemQuantityInCart,
    isFetching,
  } = React.useContext(ProductContext);

  const calculateSubtotal = cart => {
    const subtotal = cart.reduce((acc, x) => acc + x.price.amount * x.quantity, 0);
    return Math.round(subtotal * 100) / 100;
  };

  const buyAnotherPlatform = () => {
    if (buyButtonDisabled || cart.items.length <= 0) {
      return;
    }
    const path = "/purchase";
    history.push(path);
    hideCart();
  };

  const buyButtonAction = () => {
    setBuyButtonDisabled(true);
    const psTokenPromise = getPsTokenBuyCart(cart.cartId, logToken);
    psTokenPromise
      .then(response => {
        window.xPayStationInit(response.data["token"]);
        window.XPayStationWidget.open();
        window.XPayStationWidget.on(
          window.XPayStationWidget.eventTypes.CLOSE,
          () => setBuyButtonDisabled(false),
        );
        window.XPayStationWidget.on(
          window.XPayStationWidget.eventTypes.STATUS_DONE,
          payStationHandler
        );
      })
      .catch(() => setBuyButtonDisabled(false));
  };

  const buyByVirtualCurrencyButtonAction = (product, vcPriceSku) => {
    setBuyButtonDisabled(true);
    quickPurchaseBuyVirtualCurrency(product, vcPriceSku, logToken)
      .then(() => {
        clearVCCart();
        setBuyButtonDisabled(false);
        updateVirtualCurrencyBalance();
      })
      .catch(() => setBuyButtonDisabled(false))
  };

  return (
    <Modal
      open={cartShown || cartWithItemsBuyingByVCShown}
      onClose={hideCart}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 200 }}
    >
      <Fade in={cartShown}>
        <CartContent getTheme={getTheme}>
          <CartHeader getTheme={getTheme}>
            <h4>Cart</h4>
            <IconClose onClick={hideCart} />
          </CartHeader>
          <CartList>
            {cart.items.map(item => (
              <CartItem
                item={item}
                getTheme={getTheme}
                changeItemQuantity={changeItemQuantityInCart}
              />
            ))}
            {cart.items.length === 0 && <p>Empty cart</p>}
          </CartList>
          <CartFooter getTheme={getTheme}>
            {cart.items.length > 0 && (
              <Subtotal>
                Subtotal:
                <Price>
                  {isFetching
                    ? getFormattedCurrency(calculateSubtotal(cart.items), cart.items[0].price.currency).formattedCurrency
                    : getFormattedCurrency(cart.price.amount, cart.price.currency).formattedCurrency
                  }
                </Price>
              </Subtotal>
            )}
              <CartActions>
                <Button
                  variant="contained"
                  disabled={buyButtonDisabled || cart.items.length === 0}
                  style={{marginRight: '7px'}}
                  onClick={buyAnotherPlatform}
                >
                  Buy on PS4
                </Button>
                <Button
                  variant="contained"
                  disabled={buyButtonDisabled || cart.items.length === 0}
                  onClick={buyButtonAction}
                >
                  Buy on Xsolla
                </Button>
              </CartActions>
            </CartFooter>
          </CartContent>
            {/* {cartWithItemsBuyingByVCShown && (
                <Cart0>
                    <CartContent
                        style={{
                          padding: "0 32px 0 32px",
                          borderRadius: getTheme("borderRadius"),
                          backgroundColor: getTheme("colorBg"),
                          color: getTheme("colorText")
                        }}
                    >
                        <div
                            style={{
                              backgroundColor: getTheme("colorBg"),
                              color: getTheme("colorText")
                            }}
                        >
                            <CartHeader
                                style={{
                                    backgroundColor: `${getTheme("colorBg")}`,
                                    borderBottom: `1px solid ${Colorer(
                                        getTheme("colorText")
                                    )
                                        .alpha(0.1)
                                        .string()}`
                                }}
                            >
                                <h4>Confirm</h4>
                                <IconClose
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    onClick={hideCart}
                                />
                            </CartHeader>

                            <CartList>
                              {cartWithItemsBuyingByVC &&
                                cartWithItemsBuyingByVC.items.map((oneCartItem, i) => (
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
                                    cardType="buy_by_vc"
                                    cartId={cart.cartId}
                                    logToken={logToken}
                                    removeFromCart={removeFromCart}
                                    changeItemQuantityInCart={changeItemQuantityInCart}
                                    quantity={oneCartItem.quantity}
                                  />
                                ))}
                                {cartWithItemsBuyingByVC && cartWithItemsBuyingByVC.items.length <= 0 && <p>Empty cart</p>}
                            </CartList>

                            <CartFooter
                                style={{
                                  backgroundColor: `${getTheme("colorBg")}`,
                                  borderTop: `1px solid ${Colorer(getTheme("colorText"))
                                    .alpha(0.1)
                                    .string()}`
                                }}
                            >
                                {
                                    buyButtonDisabled ?
                                      <Preloader/> :
                                      <Button
                                          variant="contained"
                                          onClick={() => {
                                              !(
                                                  buyButtonDisabled ||
                                                  cartWithItemsBuyingByVC.items.length <= 0
                                              ) && buyByVirtualCurrencyButtonAction(
                                                  cartWithItemsBuyingByVC.items[0],
                                                  cartWithItemsBuyingByVC.vcPriceSku
                                              );
                                          }}
                                      >
                                          Buy
                                      </Button>
                                }
                            </CartFooter>
                        </div>
                    </CartContent>
                </Cart0>
            )} */}
      </Fade>
    </Modal>
  );
}

const Modal = styled(MUIModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconClose = styled(MUIIconClose)`
  cursor: pointer;
`;

const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${props => props.getTheme('borderRadius')};
  background-color: ${props => props.getTheme('colorBg')};
  color: ${props => props.getTheme('colorText')};
  padding: 0 32px;
  width: 680px;
  max-height: 80vh;

  @media ${device.tablet} {
    padding: 0 16px;
    max-height: none;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.getTheme('colorBg')};
  border-bottom: 1px solid ${props => Colorer(props.getTheme('colorText')).alpha(0.1).string()};
  z-index: 10;
  padding: 24px 0 8px 0;
`;

export const CartList = styled.div`
  display: grid;
  grid-row-gap: 30px;
  flex-grow: 1;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

const CartFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  background-color: ${props => props.getTheme('colorBg')};
  border-top: 1px solid ${Colorer(props => props.getTheme('colorText')).alpha(0.1).string()};
  padding: 24px 0 24px 0;
`;

const CartActions = styled.div`
  display: flex;

  @media ${device.tablet} {
    justify-content: flex-end;
    width: 100%;
  }
`;

const Subtotal = styled.div`
  display: flex;
  font-weight: bold;
  margin-right: 10px;

  @media ${device.tablet} {
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 15px;
    margin-right: 0;
  }
`;

const Price = styled.div`
  min-width: 80px;
  text-align: right;
`;

export const Cart = withRouter(CartComponent);
