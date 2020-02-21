import React from 'react';
import styled from 'styled-components';

import Avatar from '@material-ui/core/Avatar';

const Currency = ({ image, value, currency }) => (
  <Body>
    {image && <CurrencyIcon src={image} />}
    {currency && <CurrencyAcronym>{currency}</CurrencyAcronym>}
    {value}
  </Body>
);

const Body = styled.div`
  display: flex;
  align-items: center;
`;

const CurrencyAcronym = styled.span`
  margin-right: 5px;
`;

const CurrencyIcon = styled(Avatar)`
  && {
    height: 1em;
    width: 1em;
    margin-right: 5px;
  }
`;

export { Currency };
