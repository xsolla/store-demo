import React from 'react';
import styled from 'styled-components';

import {useStore} from '../../../store';
import {Preloader} from '../../../components/Preloader';
import {GameItem} from './GameItem';

const mapState = state => ({
  items: state.games.items,
  isItemAdding: state.cart.isItemAdding,
  isFetching: state.games.isFetching,
});

const mapActions = actions => ({
  load: actions.games.load,
  addToCart: actions.cart.addItem,
  addItemToVCCart: actions.vcCart.addItem,
});

const GameList = React.memo(() => {
  const {
    items,
    isItemAdding,
    isFetching,
    load,
    addToCart,
    addItemToVCCart,
  } = useStore(mapState, mapActions);
  const [activeItemID, setActiveItemID] = React.useState(null);

  const handleItemAdding = React.useCallback(
    item => {
      addToCart(item);
      setActiveItemID(item.sku);
    },
    [addToCart]
  );

  React.useEffect(() => {
    if (items.length === 0) {
      load();
    }
  }, []);

  const content = React.useMemo(
    () =>
      items.length > 0 && (
        <Content>
          {items.map((item) => (
            item.unitItems.map((unitItem, index) => (
                <GameItem
                  order={index}
                  key={unitItem.sku}
                  item={unitItem}
                  isLoading={isItemAdding && activeItemID === unitItem.sku}
                  addToCart={handleItemAdding}
                  buyByVC={addItemToVCCart}
                />
              ))
          ))}
        </Content>
      ),
    [items, isItemAdding, activeItemID, handleItemAdding]
  );

  return <Body>{isFetching ? <Preloader/> : content}</Body>;
});

const Body = styled.div`
  height: 100%;
`;

const Content = styled.div`
  display: grid;
  padding: 30px 0;
  grid-gap: 30px;
  grid-template-columns: ${({theme}) => `repeat(auto-fit, minmax(
    ${theme.shape.cardWidth}, 
    ${theme.shape.cardWidth}
  ))`};
  justify-content: center;
`;

export {GameList};
