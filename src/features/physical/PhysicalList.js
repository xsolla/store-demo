import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';

import { ProductContext } from '../../context';
import { Preloader } from '../../components/Preloader';
import { loadPhysicalGoods } from './PhysicalListLoader';
import { PhysicalItem } from './PhysicalItem';

const PhysicalList = () => {
  const {
    logToken,
    projectId,
    addToCart,
    setStateFrom,
    physicalItems,
    arePhysicalItemsFetching,
    setPhysicalItems,
    isItemAdding,
  } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

  const [activeItemID, setActiveItemID] = React.useState(null);

  const handleItemAdding = React.useCallback(item => {
    addToCart(item);
    setActiveItemID(item.sku);
  }, []);

  const loadPhysicalGoodsList = () => {
    setStateFrom('arePhysicalItemsFetching', true);
    loadPhysicalGoods(projectId, logToken)
      .then(items => {
        setPhysicalItems(items);
        setStateFrom('arePhysicalItemsFetching', false);
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
        setStateFrom('arePhysicalItemsFetching', false);
      });
  }

  React.useEffect(() => {
    loadPhysicalGoodsList();
    setActiveItemID(null);
  }, [projectId]);

  const content = React.useMemo(() => physicalItems.length > 0 && (
    <Content>
      {physicalItems.map((item, index) => (
        <PhysicalItem
          order={index}
          key={item.sku}
          product={item}
          isLoading={isItemAdding && activeItemID === item.sku}
          addToCart={handleItemAdding}
        />
      ))}
    </Content>
  ), [physicalItems, isItemAdding]);

  return (
    <Body>
      {arePhysicalItemsFetching
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
