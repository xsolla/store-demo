import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import styled from 'styled-components';
import Colorer from 'color';
import IconClose from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import MUIModal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Backdrop from '@material-ui/core/Backdrop';
import LinearProgress from '@material-ui/core/LinearProgress';

import { ProductContext } from '../../context';
import { getFormattedCurrency } from '../../utils/formatCurrency';
import { getPsTokenBuyCart } from '../../components/StoreLoader';
import { device } from '../../styles/devices';
import { routes } from '../../utils/routes';
import { CartItem } from './CartItem';

const Cart = () => {
  const [buyButtonDisabled, setBuyButtonDisabled] = React.useState(false);
  const {
    cart,
    hideCart,
    logToken,
    projectId,
    clearCart,
    isCartShown,
    removeFromCart,
    isItemRemoving,
    isCartLoading,
    changeItemQuantityInCart,
  } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const isLoading = isCartLoading || isItemRemoving;

  const cartSubtotal = React.useMemo(() => {
    const subtotal = cart.items
      .filter(item => Boolean(item.price))
      .reduce((acc, item) => acc + item.price.amount * item.quantity, 0);
    return Math.round(subtotal * 100) / 100;
  }, [cart.items]);

  const buyAnotherPlatform = () => {
    if (buyButtonDisabled || cart.items.length <= 0) {
      return;
    }

    history.push(routes.purchase);
    hideCart();
  };

  const buyButtonAction = () => {
    hideCart();
    getPsTokenBuyCart(projectId, logToken, cart.cartId)
      .then(data => {
        setBuyButtonDisabled(true);
        window.xPayStationInit(data.token, {sandbox: true, host: 'sandbox-secure.xsolla.com'});
        window.XPayStationWidget.open();
        window.XPayStationWidget.on(
          window.XPayStationWidget.eventTypes.CLOSE,
          () => setBuyButtonDisabled(false),
        );
        window.XPayStationWidget.on(
          window.XPayStationWidget.eventTypes.STATUS_DONE,
          clearCart
        );
      })
      .catch(error => {
        setBuyButtonDisabled(false);
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      });
  };

  return (
    <Modal
      open={isCartShown}
      onClose={hideCart}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 250 }}
    >
      <Grow in={isCartShown} timeout={250}>
        <CartContent>
          <CartHeader>
            <h4>Cart</h4>
            <IconButton color="inherit" onClick={hideCart}>
              <IconClose />
            </IconButton>
          </CartHeader>
          <CartList>
            {cart.items.length > 0
              ? cart.items.map(item => (
                <CartItem
                  key={item.sku}
                  item={item}
                  removeItem={removeFromCart}
                  changeItemQuantity={changeItemQuantityInCart}
                />
              ))
              : <p>Empty cart</p>
            }
          </CartList>
          <Loader>
            {isLoading && <Progress />}
          </Loader>
          <CartFooter>
            {cart.items.length > 0 && (
              <Subtotal>
                Subtotal:
                <Price>
                  {
                    getFormattedCurrency(
                      cartSubtotal,
                      cart.price.currency || cart.items[0].price.currency
                    ).formattedCurrency
                  }
                </Price>
              </Subtotal>
            )}
            <CartActions>
              <Button
                variant="contained"
                color="secondary"
                disabled={cart.items.length === 0}
                style={{ marginRight: '7px' }}
                onClick={buyAnotherPlatform}
              >
                Buy on PS4
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disabled={cart.items.length === 0}
                onClick={buyButtonAction}
              >
                Buy on Xsolla
              </Button>
            </CartActions>
          </CartFooter>
        </CartContent>
      </Grow>
    </Modal>
  );
}

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
  border-bottom: 1px solid ${({ theme }) => Colorer(theme.palette.text.primary).alpha(0.1).string()};
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
`

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
  border-top: 1px solid ${({ theme }) => Colorer(theme.palette.text.primary).alpha(0.1).string()};
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
