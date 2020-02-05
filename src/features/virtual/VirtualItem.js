import React from 'react';
import styled from "styled-components";
import Avatar from "@material-ui/core/Avatar";
import ShoppingCart from "@material-ui/icons/ShoppingCart";

import { ProductCard } from "../../components/ProductCard";

export const VirtualItem = ({
  product,
  order,
  getTheme,
  addToCart,
  buyByVC,
}) => {
  const hasVirtualCurrencyPrice = product.virtual_prices && product.virtual_prices.length > 0;

  const handleItemAdd = () => addToCart(product);
  const handleBuyByVC = () => buyByVC(product, product.virtual_prices[0].sku);

  const renderPrice = () => `${product.price.currency} ${Math.round(product.price.amount * 100) / 100}`;
  const renderVirtualPrice = () => (
    <VirtualPrice>
      <VirtualIcon src={product.virtual_prices[0].image_url} />
      <VirtualAmount>
        {product.virtual_prices[0].amount}
      </VirtualAmount>
    </VirtualPrice>
  );


  return (
    <ProductCard
      order={order}
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

const VirtualPrice = styled.div`
  display: flex;
`;

const VirtualIcon = styled(Avatar)`
  && {
    height: 24px;
    width: 24px;
    margin-right: 4px;
  }
`;

const VirtualAmount = styled.div`

`;