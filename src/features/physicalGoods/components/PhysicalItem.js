import React from 'react';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { ProductCard } from '../../../components/ProductCard';
import { Currency } from '../../../components/Currency';

export const PhysicalItem = React.memo(({
  item,
  order,
  isLoading,
  addToCart,
}) => {

  const handleItemAdd = React.useCallback(() => addToCart(item), [item, addToCart]);
  const price = React.useMemo(() => item.price ? (
    <Currency
      currency={item.price.currency}
      value={Math.round(item.price.amount * 100) / 100} />
  ) : null, [item]);

  return (
    <ProductCard
      image={item.imageUrl}
      name={item.name}
      order={order}
      value={price}
      isLoading={isLoading}
      description={item.description}
      actionButtonContent={<ShoppingCart />}
      onAction={handleItemAdd}
    />
  )
});
