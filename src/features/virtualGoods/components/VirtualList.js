import React from 'react';
import styled from 'styled-components';

import { useStore } from '../../../store';
import { Preloader } from '../../../components/Preloader.js';
import { GroupSwitcher } from '../../../components/GroupSwitcher';
import { VirtualItem } from './VirtualItem';

const mapState = state => ({
  groups: state.virtualGoods.groups,
  inventoryItems: state.inventory.items,
  cartId: state.cart.id,
  isLoading: state.virtualGoods.isFetching || state.inventory.isFetching,
  isItemAdding: state.cart.isItemAdding,
});

const mapActions = actions => ({
  loadVirtualGoods: actions.virtualGoods.load,
  loadInventory: actions.inventory.load,
  addItemToCart: actions.cart.addItem,
  addItemToVCCart: actions.vcCart.addItem,
});

const VirtualList = React.memo(() => {
  const {
    groups,
    cartId,
    isLoading,
    loadVirtualGoods,
    inventoryItems,
    loadInventory,
    addItemToCart,
    isItemAdding,
    addItemToVCCart,
  } = useStore(mapState, mapActions);

  const [activeGroup, setActiveGroup] = React.useState(null);
  const [activeItemID, setActiveItemID] = React.useState(null);

  const isItemInInventory = React.useCallback(sku => inventoryItems.some(x => sku === x.sku), [
    inventoryItems,
  ]);

  const itemGroups = React.useMemo(() => groups.map(x => ({ id: x.groupId, label: x.groupName })), [groups]);

  const handleItemAdding = React.useCallback(
    item => {
      addItemToCart(item);
      setActiveItemID(item.sku);
    },
    [addItemToCart]
  );

  React.useEffect(() => {
    setActiveGroup(groups[0] ? groups[0].groupId : null);
    setActiveItemID(null);
  }, [groups]);

  React.useEffect(() => {
    if (groups.length === 0) {
      loadVirtualGoods();
    }
  }, [groups.length, loadVirtualGoods]);

  React.useEffect(() => {
    loadInventory();
  }, [cartId, loadInventory]);

  const content = React.useMemo(
    () =>
      groups.length > 0 && (
        <>
          <GroupSwitcher groups={itemGroups} activeGroup={activeGroup} onGroupChange={setActiveGroup} />
          {groups.map(
            g =>
              activeGroup === g.groupId && (
                <React.Fragment key={g.groupId}>
                  <Title>{g.groupName}</Title>
                  <Group>
                    {g.items.map((item, index) => (
                      <VirtualItem
                        order={index}
                        key={item.sku}
                        product={item}
                        isPurchased={!item.isConsumable && isItemInInventory(item.sku)}
                        addToCart={handleItemAdding}
                        isLoading={isItemAdding && activeItemID === item.sku}
                        buyByVC={addItemToVCCart}
                      />
                    ))}
                  </Group>
                </React.Fragment>
              )
          )}
        </>
      ),
    [
      activeGroup,
      activeItemID,
      isItemAdding,
      groups,
      handleItemAdding,
      isItemInInventory,
      itemGroups,
      addItemToVCCart,
    ]
  );

  return <Body>{isLoading ? <Preloader /> : content}</Body>;
});

const Body = styled.div`
  background-color: transparent;
`;

const Group = styled.div`
  display: grid;
  padding: 30px 0;
  grid-gap: 30px;
  grid-template-columns: ${({ theme }) => `repeat(auto-fit, minmax(
    ${theme.shape.cardWidth}, 
    ${theme.shape.cardWidth}
  ))`};
  justify-content: center;
`;

const Title = styled.div`
  color: ${({ theme }) => theme.palette.primary.contrastText};
  min-height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  font-size: 1.2em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export { VirtualList };
