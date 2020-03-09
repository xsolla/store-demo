import React from 'react';
import styled from 'styled-components';

import { Preloader } from '../../../components/Preloader';
import { useStore } from '../../../store';
import { InventoryItem } from './InventoryItem';

const mapState = state => ({
  cartId: state.cart.id,
  inventoryItems: state.inventory.items,
  isInventoryFetching: state.inventory.isFetching,
  isItemConsuming: state.inventory.isConsuming,
});

const mapActions = actions => ({
  consumeItem: actions.inventory.consume,
  loadInventory: actions.inventory.load,
});

const InventoryList = React.memo(() => {
  const {
    cartId,
    inventoryItems,
    consumeItem,
    loadInventory,
    isInventoryFetching,
    isItemConsuming,
  } = useStore(mapState, mapActions);
  const [activeItemID, setActiveItemID] = React.useState(null);

  const handleConsumeItem = React.useCallback(
    item => {
      setActiveItemID(item.sku);
      consumeItem(item);
    },
    [consumeItem]
  );

  React.useEffect(() => {
    loadInventory();
  }, []);

  React.useEffect(() => {
    loadInventory();
  }, [cartId]);

  const content = React.useMemo(
    () =>
      inventoryItems.length > 0 ? (
        <Content>
          {inventoryItems.map((item, index) => (
            <InventoryItem
              order={index}
              key={item.sku}
              item={item}
              isLoading={isItemConsuming && activeItemID === item.sku}
              onConsume={handleConsumeItem}
            />
          ))}
        </Content>
      ) : (
        <EmptyText>Oops, you have nothing bought yet!</EmptyText>
      ),
    [inventoryItems, isItemConsuming, activeItemID, handleConsumeItem]
  );

  return <Body>{isInventoryFetching ? <Preloader /> : content}</Body>;
});

const Body = styled.div`
  padding: 30px 0;
`;

const Content = styled.div`
  display: grid;
  grid-gap: 30px;
  grid-template-columns: ${({ theme }) => `repeat(auto-fit, minmax(
    ${theme.shape.cardWidth}, 
    ${theme.shape.cardWidth}
  ))`};
  justify-content: center;
`;

const EmptyText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export { InventoryList };
