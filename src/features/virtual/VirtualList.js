import React from 'react';
import styled from 'styled-components';

import { ProductContext } from '../../context';
import { Preloader } from '../../components/Preloader.js';
import { GroupSwitcher } from '../../components/GroupSwitcher';
import { loadVirtualItems } from './VirtualItemsLoader';
import { VirtualItem } from './VirtualItem';

const VirtualList = () => {
  const {
    logToken,
    virtualItems,
    addToCart,
    buyByVC,
    projectId,
    areVirtualItemsFetching,
    setVirtualItems,
    setVirtualItemsError,
    setStateFrom,
    updateVirtualCurrencyBalance,
  } = React.useContext(ProductContext);

  const groups = React.useMemo(() => virtualItems.map(x => ({ id: x.groupID, label: x.groupName })), [virtualItems]);
  const [activeGroup, setActiveGroup] = React.useState(virtualItems[0] ? virtualItems[0].groupID : null);

  React.useEffect(() => {
    setActiveGroup(virtualItems[0] ? virtualItems[0].groupID : null);
  }, [virtualItems]);

  React.useEffect(() => {
    if (!areVirtualItemsFetching && logToken && virtualItems.length === 0) {
      setStateFrom('areVirtualItemsFetching', true);
      loadVirtualItems(projectId, logToken).then(virtualItems => {
        setVirtualItems(virtualItems);
        updateVirtualCurrencyBalance();
        setStateFrom('areVirtualItemsFetching', false);
      }).catch(error => {
        setVirtualItemsError(error.message);
        setStateFrom('areVirtualItemsFetching', false)
      });
    }
  }, [virtualItems]);



  const renderContent = virtualItems => {
    return virtualItems.length > 0 && (
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
                  addToCart={addToCart}
                  buyByVC={buyByVC}
                />
              ))}
            </Group>
          </React.Fragment>
        ))}
      </>
    );
  }

  return (
    <Body>
      {areVirtualItemsFetching
        ? <Preloader />
        : renderContent(virtualItems)
      }
    </Body>
  );
}

const Body = styled.div`
  color: ${props => props.theme.colorText};
  position: relative;
  background-color: transparent;
  z-index: 4;
  height: 100%;
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
