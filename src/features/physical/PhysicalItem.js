import React from 'react';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { ProductCard } from '../../components/ProductCard';
import { Currency } from '../../components/Currency';

export const PhysicalItem = React.memo(({
  product,
  order,
  isLoading,
  addToCart,
}) => {

  const handleItemAdd = () => addToCart(product);

  const price = React.useMemo(() => (
    <Currency
      currency={product.price.currency}
      value={Math.round(product.price.amount * 100) / 100} />
  ), [product]);

  return (
    <ProductCard
      image={product.image_url}
      name={product.name}
      order={order}
      value={price}
      isLoading={isLoading}
      description={product.description}
      actionButtonContent={<ShoppingCart />}
      onAction={handleItemAdd}
    />
  )
});
