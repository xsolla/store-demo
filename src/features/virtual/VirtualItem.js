import React from 'react';
import ShoppingCart from '@material-ui/icons/ShoppingCart';

import { ProductCard } from '../../components/ProductCard';
import { Currency } from '../../components/Currency';

export const VirtualItem = ({
  product,
  getTheme,
  addToCart,
  buyByVC,
}) => {
  const hasVirtualCurrencyPrice = product.virtual_prices && product.virtual_prices.length > 0;

  const handleItemAdd = () => addToCart(product);
  const handleBuyByVC = () => buyByVC(product, product.virtual_prices[0].sku);

  const renderPrice = () => (
    <Currency
      currency={product.price.currency}
      value={Math.round(product.price.amount * 100) / 100} />
  );

  const renderVirtualPrice = () => (
    <Currency
      image={product.virtual_prices[0].image_url}
      value={product.virtual_prices[0].amount}
    />
  );


  return (
    <ProductCard
      image={product.image_url}
      name={product.name}
      value={hasVirtualCurrencyPrice ? renderVirtualPrice() : renderPrice()}
      description={product.description}
      actionButtonContent={hasVirtualCurrencyPrice ? 'Buy now' : <ShoppingCart />}
      getTheme={getTheme}
      onAction={hasVirtualCurrencyPrice ? handleBuyByVC : handleItemAdd}
    />
  )
}