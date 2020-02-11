import React from 'react';
import styled from 'styled-components';

import { ProductContext } from '../../context';
import StoreLoader from '../../components/StoreLoader';
import { GroupSwitcher } from '../../components/GroupSwitcher';
import { VirtualItem } from './VirtualItem';

const VirtualList = () => {
  const {
    logToken,
    virtualItems,
    addToCart,
    buyByVC,
    setStateFrom,
    setCurrs,
    isFetching,
    updateVirtualCurrencyBalance,
  } = React.useContext(ProductContext);

  const [activeGroup, setActiveGroup] = React.useState(virtualItems[0] ? virtualItems[0].id : null);

  React.useEffect(() => {
    if (!isFetching && logToken && virtualItems.length === 0) {
      setStateFrom('isFetching', true);
      StoreLoader(window.xProjectId, logToken).then(setCurrs);
      updateVirtualCurrencyBalance();
    }
  }, [virtualItems]);

  return (
    <Body>
      {virtualItems.length > 0 && (
        <>
          <GroupSwitcher
            groups={virtualItems}
            activeGroup={activeGroup}
            onGroupChange={setActiveGroup}
          />
          {virtualItems.map(group => activeGroup === group.id ? (
            <React.Fragment key={group.id}>
              <Title>
                {group.name}
              </Title>
              <Group>
                {group.products && group.products.map((product, index) => (
                  <VirtualItem
                    order={index}
                    key={product.sku}
                    product={product}
                    addToCart={addToCart}
                    buyByVC={buyByVC}
                  />
                ))}
              </Group>
            </React.Fragment>
          ) : null
          )}
        </>
      )}
    </Body>
  );
}

const Body = styled.div`
  color: ${props => props.theme.colorText};
  position: relative;
  background-color: transparent;
  z-index: 4;
`;

const Group = styled.div`
  display: grid;
  padding: 30px 0;
  grid-gap: 30px;
  grid-template-columns: ${props => `repeat(auto-fit, minmax(
    ${props.theme.cardWidth}px, 
    ${props.theme.cardWidth}px
  ))`};
  justify-content: center;
`;

const Title = styled.div`
  color: ${props => props.theme.colorText};
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
