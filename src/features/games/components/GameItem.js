import React, {Fragment} from 'react';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import {ProductCard} from '../../../components/ProductCard';
import {Currency} from '../../../components/Currency';
import {formatRealAmount} from "../../../utils/formatCurrency";

export const GameItem = React.memo(({item, order, isLoading, addToCart, buyByVC}) => {
  const handleItemAdd = React.useCallback(() => addToCart(item), [item, addToCart]);
  const handleBuyByVC = React.useCallback(() => buyByVC(item), [item, buyByVC]);

  const title =
    <Fragment>
      <div>{item.name}</div>
      <div>DRM: {item.drmName}</div>
    </Fragment>;

  const price = React.useMemo(() => {
    if (item.virtualPrice) {
      return (
        <Currency image={item.virtualPrice.imageUrl} value={item.virtualPrice.amount} />
      );
    }

    if (item.price) {
      return (
        <Currency
          currency={item.price.currency}
          value={formatRealAmount(item.price.amount)}
        />
      );
    }

    return null;
  }, [item]);

  const buttonContent = item.hasKeys ? (item.virtualPrice ? 'Buy now' : <ShoppingCart />) : 'Sold out';
  const buttonAction = item.virtualPrice ? handleBuyByVC : handleItemAdd;

  return (
    <ProductCard
      image={item.imageUrl}
      name={title}
      order={order}
      value={price}
      isLoading={isLoading}
      description={item.description}
      actionButtonContent={buttonContent}
      onAction={buttonAction}
      purchaseEnabled={item.hasKeys}
    />
  );
});
