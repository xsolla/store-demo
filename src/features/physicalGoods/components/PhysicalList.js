import React from 'react';
import styled from 'styled-components';

import { useStore } from '../../../store';
import { Preloader } from '../../../components/Preloader';
import { PhysicalItem } from './PhysicalItem';

const mapState = state => ({
  physicalGoods: state.physicalGoods.items,
  isItemAdding: state.cart.isItemAdding,
  arePhysicalGoodsFetching: state.physicalGoods.isFetching,
});

const mapActions = actions => ({
  addToCart: actions.cart.addItem,
  loadPhysicalGoods: actions.physicalGoods.load,
});

const PhysicalList = () => {
  const {
    physicalGoods,
    isItemAdding,
    arePhysicalGoodsFetching,
    loadPhysicalGoods,
    addToCart,
  } = useStore(mapState, mapActions);
  const [activeItemID, setActiveItemID] = React.useState(null);

  const handleItemAdding = React.useCallback(item => {
    addToCart(item);
    setActiveItemID(item.sku);
  }, [addToCart]);

  React.useEffect(() => {
    if (physicalGoods.length === 0) {
      loadPhysicalGoods();
    }
  }, []);

  const content = React.useMemo(() => physicalGoods.length > 0 && (
    <Content>
      {physicalGoods.map((item, index) => (
        <PhysicalItem
          order={index}
          key={item.sku}
          item={item}
          isLoading={isItemAdding && activeItemID === item.sku}
          addToCart={handleItemAdding}
        />
      ))}
    </Content>
  ), [physicalGoods, isItemAdding, activeItemID, handleItemAdding]);

  return (
    <Body>
      {arePhysicalGoodsFetching
        ? <Preloader/>
        : content
      }
    </Body>
  );
}

const Body = styled.div`
  height: 100%;
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

export { PhysicalList };
