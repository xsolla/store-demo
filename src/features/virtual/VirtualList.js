import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';

import { ProductContext } from '../../context';
import { loadInventory } from '../inventory/InventoryLoader';
import { Preloader } from '../../components/Preloader.js';
import { GroupSwitcher } from '../../components/GroupSwitcher';
import { loadVirtualItems } from './VirtualItemsLoader';
import { VirtualItem } from './VirtualItem';

const VirtualList = () => {
  const {
    cart,
    logToken,
    virtualItems,
    inventoryItems,
    addToCart,
    buyByVC,
    projectId,
    areVirtualItemsFetching,
    areInventoryItemsFetching,
    isItemAdding,
    setInventoryItems,
    setVirtualItems,
    setStateFrom,
  } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

  const [activeGroup, setActiveGroup] = React.useState(null);
  const [activeItemID, setActiveItemID] = React.useState(null);

  const groups = React.useMemo(() => virtualItems.map(x => ({ id: x.groupID, label: x.groupName })), [virtualItems]);

  const handleItemAdding = React.useCallback(item => {
    addToCart(item);
    setActiveItemID(item.sku);
  }, []);

  React.useEffect(() => {
    setActiveGroup(virtualItems[0] ? virtualItems[0].groupID : null);
    setActiveItemID(null);
  }, [virtualItems]);

  React.useEffect(() => {
    if (!areVirtualItemsFetching && logToken && virtualItems.length === 0) {
      setStateFrom('areVirtualItemsFetching', true);
      loadVirtualItems(projectId, logToken).then(virtualItems => {
        setVirtualItems(virtualItems);
        setStateFrom('areVirtualItemsFetching', false);
      }).catch(error => {
        setStateFrom('areVirtualItemsFetching', false);
        enqueueSnackbar(error.message, { variant: 'error' });
      });
    }
  }, [virtualItems]);

  React.useEffect(() => {
    if (!areInventoryItemsFetching && logToken && inventoryItems.length === 0 && cart.cartId) {
      setStateFrom('areInventoryItemsFetching', true);
      loadInventory(projectId, logToken)
        .then(data => {
          setInventoryItems(data);
          setStateFrom('areInventoryItemsFetching', false);
        })
        .catch(error => {
          setStateFrom('areInventoryItemsFetching', false);
          enqueueSnackbar(error.message, { variant: 'error' });
        });
    }
  }, [inventoryItems, cart.cartId]);

  const content = React.useMemo(() => virtualItems.length > 0 && (
    <>
      <GroupSwitcher
        groups={groups}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
      />
      {virtualItems.map(g => activeGroup === g.groupID && (
        <React.Fragment key={g.groupID}>
          <Title>
            {g.groupName}
          </Title>
          <Group>
            {g.items.map((item, index) => (
              <VirtualItem
                order={index}
                key={item.sku}
                product={item}
                isPurchased={item.inventory_options.consumable === null && inventoryItems.some(x => item.sku === x.sku)}
                addToCart={handleItemAdding}
                isLoading={isItemAdding && activeItemID === item.sku}
                buyByVC={buyByVC}
              />
            ))}
          </Group>
        </React.Fragment>
      ))}
    </>
  ), [activeGroup, virtualItems, inventoryItems, isItemAdding]);

  return (
    <Body>
      {areVirtualItemsFetching || areInventoryItemsFetching
        ? <Preloader />
        : content
      }
    </Body>
  );
}

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
