import React from 'react';
import styled from 'styled-components';
import Loader from '@material-ui/core/CircularProgress';

import { Currency } from '../../../components/Currency';
import { useStore } from '../../../store';

const mapState = state => ({
  balances: state.user.balances,
  areBalancesLoading: state.user.areBalancesLoading,
});

const mapActions = actions => ({
  loadBalances: actions.user.loadBalances,
});

const UserBalances = React.memo(() => {
  const { balances, areBalancesLoading, loadBalances } = useStore(mapState, mapActions);

  React.useEffect(() => {
    loadBalances();
  }, []);

  return React.useMemo(
    () => (
      <Body>
        {areBalancesLoading ? (
          <Loader size={24} color='primary' />
        ) : (
          balances.map(vc => <Currency key={vc.sku} image={vc.imageUrl} value={vc.amount} />)
        )}
      </Body>
    ),
    [areBalancesLoading, balances]
  );
});

const Body = styled.div`
  display: grid;
  grid-column-gap: 10px;
  grid-auto-flow: column;
  color: ${({ theme }) => theme.palette.text.primary};
`;

export { UserBalances };
