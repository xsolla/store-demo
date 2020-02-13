import React from 'react';

import { ProductCard } from '../../components/ProductCard';

export const InventoryItem = React.memo(({
  item,
  order,
  isLoading,
  onConsume,
}) => {

  const handleItemConsume = () => onConsume(item);

  return (
    <ProductCard
      image={item.image_url}
      name={item.name}
      order={order}
      isLoading={isLoading}
      value={`Quantity: ${item.quantity}`}
      description={item.description}
      actionButtonContent="Consume"
      onAction={item.remaining_uses ? handleItemConsume : undefined}
    />
  )
});

