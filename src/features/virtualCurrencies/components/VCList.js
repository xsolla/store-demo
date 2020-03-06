import React from 'react';
import styled from 'styled-components';

import { useStore } from '../../../store';
import { Preloader } from '../../../components/Preloader';
import { VCItem } from './VCItem';

const mapState = state => ({
  virtualCurrencies: state.virtualCurrencies.items,
  isItemAdding: state.cart.isItemAdding,
  isFetching: state.virtualCurrencies.isFetching,
});

const mapActions = actions => ({
  addToCart: actions.cart.addItem,
  loadVirtualCurrencies: actions.virtualCurrencies.load,
});

const VCList = () => {
  const {
    addToCart,
    isItemAdding,
    virtualCurrencies,
    loadVirtualCurrencies,
    isFetching,
  } = useStore(mapState, mapActions);

  const [activeItemID, setActiveItemID] = React.useState(null);

  const handleItemAdding = React.useCallback(item => {
    addToCart(item);
    setActiveItemID(item.sku);
  }, [addToCart]);

  React.useEffect(() => {
    if (virtualCurrencies.length === 0) {
      loadVirtualCurrencies();
    }
  }, []);

  const content = React.useMemo(() => virtualCurrencies.length > 0 && (
    <Content>
      {virtualCurrencies.map((currency, index) => (
        <VCItem
          order={index}
          key={currency.sku}
          product={currency}
          isLoading={isItemAdding && currency.sku === activeItemID}
          addToCart={handleItemAdding}
        />
      ))}
    </Content>
  ), [virtualCurrencies, isItemAdding, activeItemID, handleItemAdding]);

  return (
    <Body>
      {isFetching
        ? <Preloader/>
        : content
      }
    </Body>
  );
}

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

export { VCList };
