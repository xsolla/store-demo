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
    isCartProcessing,
  } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

React.useEffect(() => {
  if (logToken && physicalItems.length === 0) {
    setStateFrom('arePhysicalItemsFetching', true);
    loadPhysicalGoods(projectId, logToken)
      .then(data => {
        setPhysicalItems(data);
        setStateFrom('arePhysicalItemsFetching', false);
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
        setStateFrom('arePhysicalItemsFetching', false);
      });
  }
}, [physicalItems]);

const content = React.useMemo(() => physicalItems.length > 0 && (
  <Content>
    {physicalItems.map((item, index) => (
      <PhysicalItem
        order={index}
        key={item.sku}
        product={item}
        isLoading={isCartProcessing}
        addToCart={addToCart}
      />
    ))}
  </Content>
), [physicalItems, isCartProcessing]);

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
  color: ${props => props.theme.colorText};
  position: relative;
  background-color: transparent;
  z-index: 1;
  height: 100%;
`;

const Content = styled.div`
  display: grid;
  padding: 30px 0;
  grid-gap: 30px;
  grid-template-columns: ${props => `repeat(auto-fit, minmax(
    ${props.theme.cardWidth}, 
    ${props.theme.cardWidth}
  ))`};
  justify-content: center;
`;

export { PhysicalList };
