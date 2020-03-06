import React from 'react';

import { ProductCard } from '../../../components/ProductCard';

export const InventoryItem = React.memo(({
  item,
  order,
  isLoading,
  onConsume,
}) => {

  const handleItemConsume = React.useCallback(() => onConsume(item, order), []);

  return (
    <ProductCard
      image={item.imageUrl}
      name={item.name}
      order={order}
      isLoading={isLoading}
      value={`Quantity: ${item.quantity}`}
      description={item.description}
      actionButtonContent="Consume"
      onAction={item.remainingUses ? handleItemConsume : undefined}
    />
  )
});

