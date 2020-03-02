import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import MUITextField from '@material-ui/core/TextField';
import MUIButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ProductContext } from '../../context';
import { ProductCard } from '../../components/ProductCard';
import { getEntitlement, redeem } from './EntitlementLoader';

const EntitlementList = () => {
  const {
    projectId,
    logToken,
    setEntitlementItems,
    entitlementItems,
    areEntitlementItemsFetching,
    isRedeeming,
    setStateFrom,
  } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

  const [sku, setSku] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleCodeChange = React.useCallback(event => setCode(event.target.value));
  const handleSkuChange = React.useCallback(event => setSku(event.target.value));

  const loadEntitlementItems = () => {
    setStateFrom('areEntitlementItemsFetching', true);
    getEntitlement(logToken)
      .then(items => {
        setStateFrom('areEntitlementItemsFetching', false);
        setEntitlementItems(items);
      })
      .catch(error => {
        setStateFrom('areEntitlementItemsFetching', false);
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      });
  }

  const handleSubmit = event => {
    event.preventDefault();
    setStateFrom('isRedeeming', true);
    redeem(projectId, logToken, code, sku)
      .then(() => {
        setStateFrom('isRedeeming', false);
        loadEntitlementItems();
      })
      .catch(error => {
        setStateFrom('isRedeeming', false);
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      });
  }

  React.useEffect(() => {
    loadEntitlementItems();
  }, []);

  const entitlementList = React.useMemo(() => entitlementItems.length > 0
    ? entitlementItems.map((item, key) => (
        <ProductCard
          key={item.digital_content_sku}
          order={key}
          name={item.name}
          description={item.description}
          image={item.image_url}
        />
      ))
    : (
    <div>
      Oops, you have no games yet!
    </div>
  ), [entitlementItems]);

  return (
    <Body>
      <Form onSubmit={handleSubmit}>
        <TextField
          color="secondary"
          placeholder="Enter your code"
          onChange={handleCodeChange}
          value={code}
        />
        <TextField
          color="secondary"
          placeholder="Enter sku of your game"
          onChange={handleSkuChange}
          value={sku}
        />
        <FormFooter>
          <Button type="submit" variant="contained">
            {isRedeeming ? <CircularProgress size={24} color="secondary" /> : 'Redeem Code'}
          </Button>
        </FormFooter>
      </Form>
      <List>
        {areEntitlementItemsFetching ? <CircularProgress size={24} color="secondary" /> : entitlementList}
      </List>
    </Body>
  );
}

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
  color: ${props => props.theme.colorText};
`;

const List = styled.div`
  color: ${props => props.theme.colorText};
`;

const TextField = styled(MUITextField)`
  && {
    width: 100%;
    margin-bottom: 20px;
  }

  & .MuiInput-root {
    color: ${props => props.theme.colorText}
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

export {EntitlementList};
