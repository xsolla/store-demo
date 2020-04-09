import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Colorer from 'color';
import IconClose from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import MUIModal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useStore } from '../../../store';
import { getFormattedCurrency } from '../../../utils/formatCurrency';
import { device } from '../../../styles/devices';
import { routes } from '../../../utils/routes';
import { CartItem } from './CartItem';

const mapState = state => ({
  isPublic: state.config.storeMode === 'public',
  cartItems: state.cart.items,
  price: state.cart.price,
  isCartShown: state.cart.isShown,
  isCartLoading: state.cart.isLoading,
  isItemRemoving: state.cart.isItemRemoving,
  isCartClearing: state.cart.isClearing,
});

const mapActions = actions => ({
  hideCart: actions.cart.hide,
  getCart: actions.cart.getCart,
  clearCart: actions.cart.clearCart,
  removeItem: actions.cart.removeItem,
  changeItemQuantity: actions.cart.changeItemQuantity,
  purchase: actions.cart.purchase,
  payForGoods: actions.cart.payForGoods,
});

const Cart = React.memo(() => {
  const {
    cartItems,
    price,
    isCartShown,
    isCartLoading,
    isItemRemoving,
    isPublic,
    changeItemQuantity,
    clearCart,
    hideCart,
    removeItem,
    payForGoods,
  } = useStore(mapState, mapActions);
  const history = useHistory();
  const isLoading = isCartLoading || isItemRemoving;

  const cartSubtotal = React.useMemo(() => {
    const subtotal = cartItems
      .filter(item => Boolean(item.price))
      .reduce((acc, item) => acc + item.price.amount * item.quantity, 0);
    return Math.round(subtotal * 100) / 100;
  }, [cartItems]);

  const buyAnotherPlatform = React.useCallback(() => {
    hideCart();
    history.push(routes.purchase);
  }, [hideCart, history]);

  React.useEffect(() => {
    clearCart();
  }, []);

  return React.useMemo(
    () => (
      <Modal
        open={isCartShown}
        onClose={hideCart}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 250 }}>
        <Grow in={isCartShown} timeout={250}>
          <CartContent>
            <CartHeader>
              <h4>Cart</h4>
              <IconButton color="inherit" onClick={hideCart}>
                <IconClose />
              </IconButton>
            </CartHeader>
            <CartList>
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <CartItem
                    key={item.sku}
                    item={item}
                    removeItem={removeItem}
                    changeItemQuantity={changeItemQuantity}
                  />
                ))
              ) : (
                <p>Empty cart</p>
              )}
            </CartList>
            <Loader>{isLoading && <Progress />}</Loader>
            <CartFooter>
              {cartItems.length > 0 && (
                <Subtotal>
                  Subtotal:
                  <Price>
                    {
                      getFormattedCurrency(cartSubtotal, price.currency || cartItems[0].price.currency)
                        .formattedCurrency
                    }
                  </Price>
                </Subtotal>
              )}
              <CartActions>
                {!isPublic && (
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={cartItems.length === 0}
                    onClick={buyAnotherPlatform}>
                    Buy on PS4
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={cartItems.length === 0}
                  onClick={payForGoods}>
                  Buy on Xsolla
                </Button>
              </CartActions>
            </CartFooter>
          </CartContent>
        </Grow>
      </Modal>
    ),
    [
      buyAnotherPlatform,
      cartItems,
      cartSubtotal,
      changeItemQuantity,
      hideCart,
      isCartShown,
      isLoading,
      isPublic,
      payForGoods,
      price.currency,
      removeItem,
    ]
  );
});

const Modal = styled(MUIModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CartContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 0 32px;
  width: 680px;
  max-height: 80vh;
  outline: none;

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
  color: ${({ theme }) => theme.palette.text.primary};
  border-bottom: 1px solid
    ${({ theme }) =>
      Colorer(theme.palette.text.primary)
        .alpha(0.1)
        .string()};
  z-index: 10;
  padding: 24px 0 8px 0;
`;

const Loader = styled.div`
  position: relative;
`;

const Progress = styled(LinearProgress)`
  && {
    position: absolute;
    width: 100%;
  }
`;

const CartList = styled.div`
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
  justify-content: flex-end;
  flex-wrap: wrap;
  border-top: 1px solid
    ${({ theme }) =>
      Colorer(theme.palette.text.primary)
        .alpha(0.1)
        .string()};
  padding: 24px 0 24px 0;
`;

const CartActions = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 7px;
`;

const Subtotal = styled.div`
  display: flex;
  flex-grow: 1;
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

export { Cart };
