import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import MUIDivider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Preloader } from '../../../components/Preloader';
import { useStore } from '../../../store';
import { CartItem } from '../../cart/components/CartItem';
import { getFormattedCurrency } from '../../../utils/formatCurrency';
import { device } from '../../../styles/devices';

const mapState = state => ({
  cartItems: state.cart.items,
  price: state.cart.price,
  isCartLoading: state.cart.isLoading,
  isPurchasing: state.cart.isPurchasing,
  isCartClearing: state.cart.isClearing,
});

const mapActions = actions => ({
  removeItem: actions.cart.removeItem,
  purchase: actions.cart.purchase,
  changeItemQuantity: actions.cart.changeItemQuantity,
});

const ServerPurchase = React.memo(() => {
  const {
    price,
    cartItems,
    isCartLoading,
    isPurchasing,
    isCartClearing,
    removeItem,
    purchase,
    changeItemQuantity,
  } = useStore(mapState, mapActions);

  const subtotal = React.useMemo(
    () => Math.round(cartItems.reduce((acc, x) => acc + x.price.amount * x.quantity, 0) * 100) / 100,
    [cartItems]
  );

  const cartContent = React.useMemo(
    () =>
      cartItems.length > 0 ? (
        <CartItems>
          {cartItems.map(x => (
            <React.Fragment key={x.sku}>
              <CartItem item={x} removeItem={removeItem} changeItemQuantity={changeItemQuantity} />
              <Divider />
            </React.Fragment>
          ))}
        </CartItems>
      ) : (
        <EmptyText>Oops, you have nothing bought yet!</EmptyText>
      ),
    [cartItems, removeItem, changeItemQuantity]
  );

  const footerContent = React.useMemo(
    () =>
      cartItems.length > 0 && (
        <>
          <Loader>{isCartLoading && <Progress />}</Loader>
          <CartFooter>
            <Subtotal>
              Subtotal:
              <Price>
                {
                  getFormattedCurrency(subtotal, price.currency || cartItems[0].price.currency)
                    .formattedCurrency
                }
              </Price>
            </Subtotal>
            <CartActions>
              <Button variant="contained" disabled={isPurchasing} onClick={purchase}>
                {isPurchasing ? <CircularProgress size={24} color="primary" /> : 'Grant purchase'}
              </Button>
            </CartActions>
          </CartFooter>
        </>
      ),
    [cartItems, isCartLoading, subtotal, price.currency, isPurchasing, purchase]
  );

  return (
    <Body>
      {isCartClearing ? (
        <Preloader />
      ) : (
        <Content>
          {cartContent}
          {footerContent}
        </Content>
      )}
    </Body>
  );
});

const Body = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 600px;
  padding: 0 20px;
`;

const CartItems = styled.div`
  display: grid;
  grid-row-gap: 30px;
  padding: 16px 0;
`;

const EmptyText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.palette.text.primary};
  height: 100%;
`;

const CartFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
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
  color: ${({ theme }) => theme.palette.text.primary};
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

const Divider = styled(MUIDivider)`
  &.MuiDivider-root {
    background-color: ${({ theme }) => theme.palette.primary.contrastText};
    opacity: 0.1;
    margin-bottom: 5px;
  }
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

export { ServerPurchase };
