import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';

import { Preloader } from '../../components/Preloader';
import { ProductContext } from '../../context';
import { VCItem } from './VCItem';
import { loadVirtualCurrencies } from './VCLoader';

const VCList = () => {
  const {
    logToken,
    projectId,
    addToCart,
    setStateFrom,
    virtualCurrencies,
    areVirtualCurrenciesFetching,
    isCartProcessing,
    setVirtualCurrencies,
  } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    setStateFrom('areVirtualCurrenciesFetching', true);
    loadVirtualCurrencies(projectId, logToken)
      .then(data => {
        setVirtualCurrencies(data);
        setStateFrom('areVirtualCurrenciesFetching', false);
      })
      .catch(error => {
        enqueueSnackbar(error.message, { variant: 'error' });
        setStateFrom('areVirtualCurrenciesFetching', false);
      });
  }, []);

  const content = React.useMemo(() => virtualCurrencies.length > 0 && (
    <Content>
      {virtualCurrencies.map((currency, index) => (
        <VCItem
          order={index}
          key={currency.sku}
          product={currency}
          isLoading={isCartProcessing}
          addToCart={addToCart}
        />
      ))}
    </Content>
  ), [virtualCurrencies, isCartProcessing]);

  return (
    <Body>
      {areVirtualCurrenciesFetching
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
