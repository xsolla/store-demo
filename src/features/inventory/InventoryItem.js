import React from 'react';

import { ProductCard } from '../../components/ProductCard';

export const InventoryItem = React.memo(({
  item,
  order,
  onConsume,
}) => {

  const handleItemConsume = () => onConsume(item);

  return (
    <ProductCard
      image={item.image_url}
      name={item.name}
      order={order}
      value={`Quantity: ${item.quantity}`}
      description={item.description}
      actionButtonContent="Consume"
      onAction={item.remaining_uses ? handleItemConsume : undefined}
    />
  )
});

