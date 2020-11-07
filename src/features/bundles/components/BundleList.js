import React from 'react';
import styled from 'styled-components';

import { useStore } from '../../../store';
import { Preloader } from '../../../components/Preloader.js';
import { Bundle } from './BundleItem';

const mapState = ({
  bundles,
  virtualGoods,
  inventory,
  cart,
}) => ({
  bundles: bundles.bundles,
  groups: virtualGoods.groups,
  inventoryItems: inventory.items,
  cartId: cart.id,
  isLoading: bundles.isFetching || inventory.isFetching,
  isItemAdding: cart.isItemAdding,
});

const mapActions = ({ bundles, inventory, cart, vcCart }) => ({
  loadBundles: bundles.load,
  loadInventory: inventory.load,
  addItemToCart: cart.addItem,
  addItemToVCCart: vcCart.addItem,
});

const BundleList = React.memo(() => {
  const {
    bundles,
    cartId,
    isLoading,
    loadBundles,
    inventoryItems,
    loadInventory,
    addItemToCart,
    isItemAdding,
    addItemToVCCart,
  } = useStore(mapState, mapActions);
  const [activeItemID, setActiveItemID] = React.useState(null);
  const isItemInInventory = React.useCallback(sku => inventoryItems.some(x => sku === x.sku), [
    inventoryItems,
  ]);
  const handleItemAdding = React.useCallback((item) => {
    addItemToCart(item);
    setActiveItemID(item.sku);
  }, [addItemToCart]);

  React.useEffect(() => {
    if (bundles.length === 0) {
      loadBundles();
    }
  }, [bundles.length, loadBundles]);

  React.useEffect(() => {
    loadInventory();
  }, [cartId, loadInventory]);

  const content = React.useMemo(
    () => (
      <Content>
        {bundles.map((bundle, index) => (
          <Bundle
            order={index}
            key={bundle.sku}
            product={bundle}
            isPurchased={false}
            addToCart={handleItemAdding}
            isLoading={isItemAdding && activeItemID === bundle.sku}
            buyByVC={addItemToVCCart}
          />
        ))}
      </Content>
    ),
    [
      isItemAdding,
      bundles,
      handleItemAdding,
      isItemInInventory,
      addItemToVCCart,
    ]
  );

  return <Body>{isLoading ? <Preloader /> : content}</Body>;
});

const Body = styled.div`
  background-color: transparent;
`;

const Content = styled.div`
  display: grid;
  padding: 30px 0;
  grid-gap: 30px;
  grid-template-columns: ${({ theme }) => `repeat(auto-fit, minmax(
    ${theme.shape.cardWidth}, 
    ${theme.shape.cardWidth}
  ))`};
  justify-content: center;
`;

export { BundleList };
