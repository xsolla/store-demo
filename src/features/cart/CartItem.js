import React from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import MUIDeleteIcon from "@material-ui/icons/Delete";
import MUIIncrementIcon from "@material-ui/icons/AddBox";
import MUIDecrementIcon from "@material-ui/icons/IndeterminateCheckBox";

import { device } from '../../styles/devices';

const CartItemComponent = ({ item, changeItemQuantity }) => {
  const calcPrice = (price, quantity) => Math.round(price * quantity * 100) / 100;
  const handleQuantityDec = () => changeItemQuantity(item, item.quantity - 1);
  const handleQuantityInc = () => changeItemQuantity(item, item.quantity + 1);
  
  return (
    <CartItem>
      <CartItemImage image={item.image_url} />
      <CartItemBody>
        <ItemName>{item.name}</ItemName>
        <ItemPrice>
          <CartItemTotal>
            {item.price.currency} {calcPrice(item.price.amount, item.quantity)}
          </CartItemTotal>
          {item.quantity > 1 && (
            <CartItemPriceForOne>
              {item.price.currency} {calcPrice(item.price.amount, 1)} for one item
            </CartItemPriceForOne>
          )}
        </ItemPrice>
      </CartItemBody>
      <PriceInfo>
        <QuantityActions>
          {item.quantity > 1
            ? (
              <IconButton color="inherit" onClick={handleQuantityDec}>
                <DecrementIcon />
              </IconButton>
            ) : (
              <IconButton color="inherit" onClick={handleQuantityDec}>
                <DeleteIcon />
              </IconButton>
            )
          }
          <ItemQuantity>{item.quantity}</ItemQuantity>
          <IconButton color="inherit" onClick={handleQuantityInc}>
            <IncrementIcon />
          </IconButton>
        </QuantityActions>
      </PriceInfo>
    </CartItem>
  );
}

const CartItem = styled.div`
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

const CartItemImage = styled.div`
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => props.image});
`;

const CartItemBody = styled.div`  
  padding: 10px;
`;

const ItemName = styled.div`
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

export { CartItemComponent as CartItem };