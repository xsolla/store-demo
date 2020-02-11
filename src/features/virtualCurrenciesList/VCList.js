import React from 'react';
import styled from 'styled-components';

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
    setVirtualCurrencies,
    setVirtualCurrenciesError,
  } = React.useContext(ProductContext);

  React.useEffect(() => {
    if (!areVirtualCurrenciesFetching && logToken && virtualCurrencies.length === 0) {
      setStateFrom('areVirtualCurrenciesFetching', true);
      loadVirtualCurrencies(projectId, logToken)
        .then(data => {
          setVirtualCurrencies(data);
          setStateFrom('areVirtualCurrenciesFetching', false);
        })
        .catch(error => {
          setVirtualCurrenciesError(error.message);
          setStateFrom('areVirtualCurrenciesFetching', false);
        });
    }
  }, [virtualCurrencies]);

  const content = React.useMemo(() => virtualCurrencies.length > 0 && (
    <Content>
      {virtualCurrencies.map((currency, index) => (
        <VCItem
          order={index}
          key={currency.sku}
          product={currency}
          addToCart={addToCart}
        />
      ))}
    </Content>
  ), [virtualCurrencies]);

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
    ${props.theme.cardWidth}px, 
    ${props.theme.cardWidth}px
  ))`};
  justify-content: center;
`;

export { VCList };
