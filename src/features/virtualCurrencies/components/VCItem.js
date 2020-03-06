import React from 'react';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { ProductCard } from '../../../components/ProductCard';
import { Currency } from '../../../components/Currency';

export const VCItem = React.memo(({
  product,
  order,
  isLoading,
  addToCart,
}) => {

  const handleItemAdd = React.useCallback(() => addToCart(product), []);
  const actionButtonContent = React.useMemo(() => <ShoppingCart />, []);

  const price = React.useMemo(() => (
    <Currency
      currency={product.price.currency}
      value={Math.round(product.price.amount * 100) / 100} />
  ), [product]);

  return (
    <ProductCard
      image={product.imageUrl}
      name={product.name}
      order={order}
      value={price}
      isLoading={isLoading}
      description={product.description}
      actionButtonContent={actionButtonContent}
      onAction={handleItemAdd}
    />
  )
});
