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
  isPurchased,
}) => {
  const hasVirtualCurrencyPrice = product.virtual_prices && product.virtual_prices.length > 0;

  const handleBuyByVC = React.useCallback(() => buyByVC(product), []);
  const handleItemAdd = React.useCallback(() => addToCart(product), []);
  
  const buttonAction = React.useMemo(() => hasVirtualCurrencyPrice ? handleBuyByVC : handleItemAdd, [hasVirtualCurrencyPrice]);
  const buttonContent = React.useMemo(() => hasVirtualCurrencyPrice ? 'Buy now' : <ShoppingCart />, [product]);
  const price = React.useMemo(() => {
    if (isPurchased) {
      return 'Purchased';
    }

    if (hasVirtualCurrencyPrice) {
      return (
        <Currency
          image={product.virtual_prices[0].image_url}
          value={product.virtual_prices[0].amount}
        />
      );
    }

    return (
      <Currency
        currency={product.price.currency}
        value={Math.round(product.price.amount * 100) / 100}
      />
    );
  }, [product, hasVirtualCurrencyPrice, isPurchased]);

  return (
    <ProductCard
      image={product.image_url}
      name={product.name}
      order={order}
      value={price}
      isLoading={isLoading}
      description={product.description}
      actionButtonContent={buttonContent}
      onAction={!isPurchased ? buttonAction : undefined}
    />
  )
});
