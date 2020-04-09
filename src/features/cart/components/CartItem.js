import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import MUIDeleteIcon from '@material-ui/icons/Delete';
import MUIIncrementIcon from '@material-ui/icons/AddBox';
import MUIDecrementIcon from '@material-ui/icons/IndeterminateCheckBox';

import { device } from '../../../styles/devices';

const CartItem = React.memo(({ item, changeItemQuantity, removeItem }) => {
  const price = React.useMemo(() => Math.round(item.price.amount * item.quantity * 100) / 100, [
    item.price.amount,
    item.quantity,
  ]);

  const priceForOne = React.useMemo(() => Math.round((item.price.amount * 100) / 100), [
    item.price.amount,
  ]);

  const handleQuantityDec = React.useCallback(() => changeItemQuantity(item, item.quantity - 1), [
    item,
    changeItemQuantity,
  ]);

  const handleQuantityInc = React.useCallback(() => changeItemQuantity(item, item.quantity + 1), [
    item,
    changeItemQuantity,
  ]);

  const handelItemRemove = React.useCallback(() => removeItem(item), [item, removeItem]);

  return (
    <Body>
      <Image image={item.imageUrl} />
      <Content>
        <Name>{item.name}</Name>
        <ItemPrice>
          <CartItemTotal>
            {item.price.currency} {price}
          </CartItemTotal>
          {item.quantity > 1 && (
            <CartItemPriceForOne>
              {item.price.currency} {priceForOne} for one item
            </CartItemPriceForOne>
          )}
        </ItemPrice>
      </Content>
      <PriceInfo>
        <QuantityActions>
          {item.quantity > 1 ? (
            <IconButton color='inherit' onClick={handleQuantityDec}>
              <DecrementIcon />
            </IconButton>
          ) : (
            <IconButton color='inherit' onClick={handelItemRemove}>
              <DeleteIcon />
            </IconButton>
          )}
          <ItemQuantity>{item.quantity}</ItemQuantity>
          <IconButton color='inherit' onClick={handleQuantityInc}>
            <IncrementIcon />
          </IconButton>
        </QuantityActions>
      </PriceInfo>
    </Body>
  );
});

const Body = styled.div`
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 1fr;
  color: ${({ theme }) => theme.palette.text.primary};
  overflow: hidden;
  height: 130px;

  @media ${device.mobileL} {
    height: 185px;
    grid-template-columns: 0.9fr 1.1fr;
    grid-template-rows: 120px 1fr;
  }
`;

const Image = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const Content = styled.div`
  padding: 10px;
`;

const Name = styled.div`
  font-weight: bolder;
  margin-bottom: 5px;
`;

const QuantityActions = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
  min-width: 44px;
  font-size: 1.2em;
`;

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;

  @media ${device.mobileL} {
    grid-column: 2 / 2;
  }
`;

const ItemPrice = styled.div`
  display: flex;
  flex-direction: column;

  @media ${device.mobileL} {
    flex-grow: 1;
  }
`;

const CartItemTotal = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: 600;
`;

const CartItemPriceForOne = styled.div`
  font-size: 0.8em;
  opacity: 0.3;
`;

const DeleteIcon = styled(MUIDeleteIcon)`
  @media ${device.mobileL} {
    && {
      width: 1.5em;
      height: 1.5em;
    }
  }
`;
const DecrementIcon = styled(MUIDecrementIcon)`
  @media ${device.mobileL} {
    && {
      width: 1.5em;
      height: 1.5em;
    }
  }
`;
const IncrementIcon = styled(MUIIncrementIcon)`
  @media ${device.mobileL} {
    && {
      width: 1.5em;
      height: 1.5em;
    }
  }
`;

export { CartItem };
