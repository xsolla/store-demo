import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Loader from '@material-ui/core/CircularProgress';
import MUIDivider from '@material-ui/core/Divider';

import { ProductContext } from '../../context';
import { CartItem } from '../cart/CartItem';
import { getFormattedCurrency } from '../../utils/formatCurrency';
import { generateUUID } from '../../utils/generateUUID';
import { device } from '../../styles/devices';
import { purchaseItems } from './ServerPurchaseLoader';

const ServerPurchase = () => {
  const { cart, changeItemQuantityInCart } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

  const [isPurchasing, setPurchasing] = React.useState();

  const calculateSubtotal = cart => {
    const subtotal = cart.reduce((acc, x) => acc + x.price.amount * x.quantity, 0);
    return Math.round(subtotal * 100) / 100;
  };

  const purchase = React.useCallback(() => {
    const data = {
      type: 'purchase',
      user: 'd342dad2-9d59-11e9-a384-42010aa8003f',
      platform: 'playstation_network',
      purchase: {
        amount: cart.price.amount,
        currency: cart.price.currency,
        external_purchase_id: generateUUID(),
        external_purchase_date: (new Date()).toISOString()
      },
      items: cart.items.map(({ sku, quantity }) => ({ sku, quantity })),
    };

    setPurchasing(true);
    enqueueSnackbar('Operation is processing', { variant: 'info' });
    purchaseItems(data)
      .then(() => {
        setPurchasing(false);
        enqueueSnackbar('Complete', { variant: 'success' });
      })
      .catch(error => {
        setPurchasing(false);
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }, []);

  const cartContent = React.useMemo(
    () => cart.items.length > 0
      ? (
        <CartItems>
          {cart.items.map(x => (
            <React.Fragment key={x.sku}>
              <CartItem
                item={x}
                changeItemQuantity={changeItemQuantityInCart}
              />
              <Divider/>
            </React.Fragment>
          ))}
        </CartItems>
      ) : (
        <EmptyText>
          Oops, you have nothing bought yet!
        </EmptyText>
      ),
    [cart]
  );

  const footerContent = React.useMemo(() => cart.items.length > 0 && (
    <CartFooter>
      <Subtotal>
        Subtotal:
        <Price>
          {
            getFormattedCurrency(
              calculateSubtotal(cart.items),
              cart.price.currency || cart.items[0].price.currency
            ).formattedCurrency
          }
        </Price>
      </Subtotal>
      <CartActions>
        <Button
          variant="contained"
          disabled={isPurchasing}
          onClick={purchase}
        >
          {isPurchasing ? <Loader size={24} color="secondary" /> : 'Grant purchase'}
        </Button>
      </CartActions>
    </CartFooter>
  ), [cart, isPurchasing]);

  return (
    <Body>
      <Content>
        {cartContent}
        {footerContent}
      </Content>
    </Body>
  );
};

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

export { ServerPurchase };
