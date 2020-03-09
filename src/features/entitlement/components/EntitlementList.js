import React from 'react';
import styled from 'styled-components';
import MUITextField from '@material-ui/core/TextField';
import MUIButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useStore } from '../../../store';
import { ProductCard } from '../../../components/ProductCard';

const mapState = state => ({
  entitlementItems: state.entitlement.items,
  isEntitlementFetching: state.entitlement.isFetching,
  isItemRedeeming: state.entitlement.isRedeeming,
});

const mapActions = actions => ({
  redeem: actions.entitlement.redeem,
  loadEntitlement: actions.entitlement.load,
});

const EntitlementList = () => {
  const {
    entitlementItems,
    isEntitlementFetching,
    isItemRedeeming,
    redeem,
    loadEntitlement,
  } = useStore(mapState, mapActions);

  const [sku, setSku] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleCodeChange = React.useCallback(event => setCode(event.target.value), []);
  const handleSkuChange = React.useCallback(event => setSku(event.target.value), []);

  const handleSubmit = React.useCallback(
    event => {
      event.preventDefault();
      redeem(code, sku);
    },
    [redeem, code, sku]
  );

  React.useEffect(() => {
    loadEntitlement();
  }, []);

  const entitlementList = React.useMemo(
    () =>
      entitlementItems.length > 0 ? (
        entitlementItems.map((item, key) => (
          <ProductCard
            key={item.sku}
            order={key}
            name={item.name}
            description={item.description}
            image={item.imageUrl}
          />
        ))
      ) : (
        <div>Oops, you have no games yet!</div>
      ),
    [entitlementItems]
  );

  return (
    <Body>
      <Form onSubmit={handleSubmit}>
        <TextField
          color='primary'
          placeholder='Enter your code'
          onChange={handleCodeChange}
          value={code}
        />
        <TextField
          color='primary'
          placeholder='Enter sku of your game'
          onChange={handleSkuChange}
          value={sku}
        />
        <FormFooter>
          <Button color='secondary' type='submit' variant='contained'>
            {isItemRedeeming ? <CircularProgress size={24} color='primary' /> : 'Redeem Code'}
          </Button>
        </FormFooter>
      </Form>
      <div>
        {isEntitlementFetching ? <CircularProgress size={24} color='primary' /> : entitlementList}
      </div>
    </Body>
  );
};

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
`;

const Form = styled.form`
  max-width: 400px;
  width: 100%;
  padding: 20px;
`;

const TextField = styled(MUITextField)`
  && {
    width: 100%;
    margin-bottom: 20px;
  }
`;

const Button = styled(MUIButton)`
  && {
    min-width: 140px;
  }
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
`;

export { EntitlementList };
