import React from 'react';
import styled from 'styled-components';

import { Preloader } from '../../components/Preloader';
import { ProductContext } from '../../context';
import { InventoryItem } from './InventoryItem';
import { loadInventory, consumeItem } from './InventoryLoader';

const InventoryList = () => {
  const {
    logToken,
    projectId,
    setStateFrom,
    inventoryItems,
    isItemConsuming,
    areInventoryItemsFetching,
    setInventoryItems,
    setInventoryItemsError,
  } = React.useContext(ProductContext);

  const handleConsumeItem = React.useCallback((item) => {
    setStateFrom('isItemConsuming', true);
    consumeItem(projectId, logToken, item)
      .then(() => {
        setInventoryItems([]);
        setStateFrom('isItemConsuming', false);
      })
      .catch(error => {
        setInventoryItemsError(error.message);
        setStateFrom('isItemConsuming', false);
      });
  });

  React.useEffect(() => {
    if (logToken && inventoryItems.length === 0) {
      setStateFrom('areInventoryItemsFetching', true);
      loadInventory(projectId, logToken)
        .then(data => {
          setInventoryItems(data);
          setStateFrom('areInventoryItemsFetching', false);
        })
        .catch(error => {
          setInventoryItemsError(error.message);
          setStateFrom('areInventoryItemsFetching', false);
        });
    }

    return () => inventoryItems.length > 0 && setInventoryItems([]);
  }, [inventoryItems]);

  const content = React.useMemo(() => inventoryItems.length > 0 ? (
    <Content>
      {inventoryItems.map((item, index) => (
        <InventoryItem
          order={index}
          key={item.sku}
          item={item}
          onConsume={handleConsumeItem}
        />
      ))}
    </Content>
  ) : (
    <EmptyText>Oops, you have nothing bought yet!</EmptyText>
  ), [inventoryItems]);

  return (
    <Body>
      {areInventoryItemsFetching || isItemConsuming
        ? <Preloader/>
        : content
      }
    </Body>
  );
}

const Body = styled.div`
  color: ${props => props.theme.colorText};
  position: relative;
  background-color: transparent;
  z-index: 1;
  height: 100%;
`;

const Content = styled.div`
  display: grid;
  padding: 30px 0;
  grid-gap: 30px;
  grid-template-columns: ${props => `repeat(auto-fit, minmax(
    ${props.theme.cardWidth}px, 
    ${props.theme.cardWidth}px
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
