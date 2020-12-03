import React from 'react';
import styled from 'styled-components';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { ProductCard } from '../../../components/ProductCard';
import { Currency } from '../../../components/Currency';
import {formatRealAmount} from "../../../utils/formatCurrency";

export const VirtualItem = React.memo(
  ({ product, order, isLoading, addToCart, buyByVC, isPurchased }) => {
    const handleBuyByVC = React.useCallback(() => buyByVC(product), [product, buyByVC]);
    const handleItemAdd = React.useCallback(() => addToCart(product), [product, addToCart]);

    const buttonAction = React.useMemo(
      () => (product.virtualPrice ? handleBuyByVC : handleItemAdd),
      [product, handleBuyByVC, handleItemAdd]
    );
    const buttonContent = React.useMemo(
      () => (product.virtualPrice ? 'Buy now' : <ShoppingCart />),
      [product]
    );
    const price = React.useMemo(() => {
      if (isPurchased) {
        return <Purchased>Purchased</Purchased>;
      }

      if (product.virtualPrice) {
        return (
          <Currency image={product.virtualPrice.imageUrl} value={product.virtualPrice.amount} />
        );
      }

      if (product.price) {
          return (
              <Currency
                  currency={product.price.currency}
                  value={formatRealAmount(product.price.amount)}
              />
          );
      }
    }, [product, isPurchased]);

    return (
      <ProductCard
        image={product.imageUrl}
        name={product.name}
        order={order}
        value={price}
        isLoading={isLoading}
        description={product.description}
        actionButtonContent={buttonContent}
        onAction={!isPurchased ? buttonAction : undefined}
        attributes={product.attributes}
      />
    );
  }
);

const Purchased = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.8;
`;
