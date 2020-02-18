import React from 'react';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { ProductCard } from '../../components/ProductCard';
import { Currency } from '../../components/Currency';

export const VirtualItem = React.memo(({
  product,
  order,
  isLoading,
  addToCart,
  buyByVC,
}) => {
  const handleBuyByVC = () => buyByVC(product);
  const handleItemAdd = () => addToCart(product);
  
  const hasVirtualCurrencyPrice = product.virtual_prices && product.virtual_prices.length > 0;
  const buttonContent = React.useMemo(() => hasVirtualCurrencyPrice ? 'Buy now' : <ShoppingCart />, [product]);
  const price = React.useMemo(() => hasVirtualCurrencyPrice
    ? (
      <Currency
        image={product.virtual_prices[0].image_url}
        value={product.virtual_prices[0].amount}
      />
    ) : (
      <Currency
        currency={product.price.currency}
        value={Math.round(product.price.amount * 100) / 100}
      />
    ), [product]);

  return (
    <ProductCard
      image={product.image_url}
      name={product.name}
      order={order}
      value={price}
      isLoading={isLoading}
      description={product.description}
      actionButtonContent={buttonContent}
      onAction={hasVirtualCurrencyPrice ? handleBuyByVC : handleItemAdd}
    />
  )
});
