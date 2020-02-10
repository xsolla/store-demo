import React from 'react';
import styled from 'styled-components';
import MUITabs from '@material-ui/core/Tabs';
import MUITab from '@material-ui/core/Tab';

import { ProductContext } from '../../context';
import StoreLoader from '../../components/StoreLoader';
import { VirtualItem } from './VirtualItem';

const VirtualList = () => {
  const {
    logToken,
    virtualItems,
    activeGroup,
    getTheme,
    addToCart,
    buyByVC,
    setStateFrom,
    setCurrs,
    isFetching,
    updateVirtualCurrencyBalance,
  } = React.useContext(ProductContext);

  const handleGroupChange = (_, activeGroup) => setStateFrom('activeGroup', activeGroup);
  const activeGroupID = virtualItems.length > 0 && activeGroup === 'first' ? virtualItems[0].id : activeGroup;

  React.useEffect(() => {
    if (!isFetching && logToken && virtualItems.length === 0) {
      setStateFrom('isFetching', true);
      StoreLoader(window.xProjectId, logToken).then(setCurrs);
      updateVirtualCurrencyBalance();
    }
  });

  return (
    <Body color={getTheme('colorText')}>
      {virtualItems.length > 0 && (
        <>
          <Tabs
            getTheme={getTheme}
            value={activeGroupID}
            onChange={handleGroupChange}
            variant="scrollable"
          >
            {virtualItems.map(group => (
              <Tab
                getTheme={getTheme}
                value={group.id}
                key={group.id}
                color="secondary"
                textColor="secondary"
                label={group.name}
              />
            ))}
          </Tabs>
          {virtualItems.map(group => activeGroupID === group.id ? (
            <>
              <Title color={getTheme('colorText')}>
                {group.name}
              </Title>
              <Group getTheme={getTheme}>
                {group.products && group.products.map(product => (
                  <VirtualItem
                    key={product.sku}
                    product={product}
                    addToCart={addToCart}
                    getTheme={getTheme}
                    buyByVC={buyByVC}
                  />
                ))}
              </Group>
            </>
          ) : null
          )}
        </>
      )}
    </Body>
  );
}

const Body = styled.div`
  color: ${props => props.color};
  position: relative;
  background-color: transparent;
  z-index: 4;
`;

const Group = styled.div`
  display: grid;
  padding: 30px 0;
  grid-gap: 30px;
  grid-template-columns: ${props => `repeat(auto-fit, minmax(
    ${props.getTheme('cardWidth')}px, 
    ${props.getTheme('cardWidth')}px)
  )`};
  justify-content: center;
`;

const Title = styled.div`
  color: ${props => props.color};
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

const Tabs = styled(MUITabs)`
  padding: 30px 0;
  color: ${props => props.getTheme('colorAccent')};
  
  & .MuiTabs-flexContainer {
    justify-content: center;
  };
`;

const Tab = styled(MUITab)`
  &.MuiTab-root {
    color: ${props => props.getTheme('colorAccentText')};
    font-family: ${props => props.getTheme('fontFamily')};
  };
`;

export { VirtualList };
