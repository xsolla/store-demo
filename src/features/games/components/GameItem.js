import React, {Fragment} from 'react';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import {ProductCard} from '../../../components/ProductCard';
import {Currency} from '../../../components/Currency';
import {formatRealAmount} from "../../../utils/formatCurrency";

export const GameItem = React.memo(({item, attributes, order, isLoading, addToCart, buyByVC}) => {
  const handleItemAdd = React.useCallback(() => addToCart(item), [item, addToCart]);
  const handleBuyByVC = React.useCallback(() => buyByVC(item), [item, buyByVC]);

  const getButtonContent = (item) => {
    if (item.isPreOrder) {
      return 'Pre-order';
    }
    if (item.hasKeys) {
      return item.virtualPrice ? 'Buy now' : <ShoppingCart />;
    }
    return 'Sold out';
  };

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

  const isSoldOut = !item.isPreOrder && !item.hasKeys;

  const buttonContent = getButtonContent(item);
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
      purchaseEnabled={!isSoldOut}
      attributes={attributes}
    />
  );
});
