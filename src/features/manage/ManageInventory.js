import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';

import MUITextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { ProductContext } from '../../context';
import { GroupSwitcher } from '../../components/GroupSwitcher';
import { Preloader } from '../../components/Preloader.js';
import { loadVirtualCurrencies, loadVirtualItems, rewardItems } from './ManageInventoryLoader';

const users = [
  {
    id: 'd342dad2-9d59-11e9-a384-42010aa8003f',
    name: 'support@xsolla.com',
  },
  {
    id: '7d8b1f52-7d3f-400b-acd8-46e3a4368596',
    name: 'v.legotkin@xsolla.com',
  },
  {
    id: '27bc1227-48a3-4da8-bb86-f8d093f68805',
    name: 'r.ushakov@xsolla.com',
  },
  {
    id: 'a7d10a4e-3f68-43cc-a6b2-893d2c68fd14',
    name: 'p.sanachev@xsolla.com',
  },
];

const groups = [
  {
    id: 'items',
    label: 'Items',
  },
  {
    id: 'currencies',
    label: 'Currencies',
  },
];

const ManageInventory = () => {
  const { projectId } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

  const [userID, setUserID] = React.useState(null);
  const [activeGroup, setActiveGroup] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isItemProcessing, setItemProcessing] = React.useState(false);
  
  const [areManageItemsFetching, setManageItemsFetching] = React.useState(false);
  const [manageItems, setManageItems] = React.useState([]);

  const [areManageCurrenciesFetching, setManageCurrenciesFetching] = React.useState(false);
  const [manageCurrencies, setManageCurrencies] = React.useState([]);

  const isFetching = areManageItemsFetching || areManageCurrenciesFetching;
  const userOptions = React.useMemo(() => users.map(x => <MenuItem value={x.id}>{x.name}</MenuItem>, users));
  const itemsOptions = React.useMemo(() => manageItems.map(x => <MenuItem value={x.sku}>{x.name}</MenuItem>, manageItems));
  const currenciesOptions = React.useMemo(() => manageCurrencies.map(x => <MenuItem value={x.sku}>{x.name}</MenuItem>, manageCurrencies));

  const groupsContent = {
    items: {
      name: 'Item',
      items: manageItems,
      options: itemsOptions,
    },
    currencies: {
      name: 'Currency',
      items: manageCurrencies,
      options: currenciesOptions,
    },
  };

  const processItem = type => {
    if (!selectedItem || !userID) {
      return;
    }

    const data = { type, user: userID, item: selectedItem, count: quantity };
    setItemProcessing(true);
    enqueueSnackbar('Operation is processing', { variant: 'info' });
    rewardItems(data)
      .then(() => {
        setItemProcessing(false);
        enqueueSnackbar('Complete', { variant: 'success' });
      })
      .catch(error => {
        setItemProcessing(false);
        enqueueSnackbar(error.message, { variant: 'error' });
      });
  }
  
  const handleFormSubmit = event => event.preventDefault();
  const handleRewardItem = () => processItem('reward');
  const handleRevokeItem = () => processItem('revoke');
  const handleUserSelect = event => setUserID(event.target.value);
  const handleItemSelect = event => setSelectedItem(event.target.value);
  const handleQuantityChange = event => setQuantity(event.target.value);

  React.useEffect(() => {
    setUserID(users[0] ? users[0].id : null);
  }, [users]);

  React.useEffect(() => {
    setActiveGroup(groups[0] ? groups[0].id : null);
  }, [groups]);

  React.useEffect(() => {
    if (!selectedItem && activeGroup && groupsContent[activeGroup] && groupsContent[activeGroup].items[0]) {
      setSelectedItem(groupsContent[activeGroup].items[0].sku);
    }
  }, [manageItems, manageCurrencies]);

  React.useEffect(() => {
    if (manageItems.length === 0) {
      setManageItemsFetching(true);
      loadVirtualItems(projectId)
        .then(items => {
          setManageItemsFetching(false);
          setManageItems(items);
        })
        .catch(error => {
          setManageItemsFetching(false);
          enqueueSnackbar(error.message, { variant: 'error' })
        });
    }
  }, [manageItems]);

  React.useEffect(() => {
    if (manageItems.length === 0) {
      setManageCurrenciesFetching(true);
      loadVirtualCurrencies(projectId)
        .then(items => {
          setManageCurrenciesFetching(false);
          setManageCurrencies(items);
        })
        .catch(error => {
          setManageCurrenciesFetching(false);
          enqueueSnackbar(error.message, { variant: 'error' })
        });
    }
  }, [manageCurrencies]);
    
  return (
    <Body>
      {isFetching
        ? <Preloader />
        : (
          <Form onSubmit={handleFormSubmit}>
            <TextField
              select
              label="User"
              value={userID}
              color="secondary"
              onChange={handleUserSelect}
            >
              {userOptions}
            </TextField>
            <GroupSwitcher
              groups={groups}
              activeGroup={activeGroup}
              onGroupChange={setActiveGroup}
            />
            <Items>
              {groupsContent[activeGroup] && (
                <TextField
                  select
                  label={groupsContent[activeGroup].name}
                  value={groupsContent[activeGroup].items[0].sku}
                  color="secondary"
                  onChange={handleItemSelect}
                >
                  {groupsContent[activeGroup].options}
                </TextField>
              )}
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                color="secondary"
                onChange={handleQuantityChange}
              />
            </Items>
            <FormActions>
              <RewardButton
                type="submit"
                variant="contained"
                disabled={isItemProcessing}
                onClick={handleRewardItem}
              >
                Reward
              </RewardButton>
              <Button
                variant="contained"
                disabled={isItemProcessing}
                onClick={handleRevokeItem}
              >
                Revoke
              </Button>
            </FormActions>
          </Form>
        )
      }
    </Body>
  );
};

const Body = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
`;

const Form = styled.form`
  max-width: 400px;
  width: 100%;
  padding: 20px;
  color: ${props => props.theme.colorText};
`;

const TextField = styled(MUITextField)`
  width: 100%;

  & .MuiFormLabel-root {
    color: ${props => props.theme.colorText}
  }

  & .MuiInput-root {
    color: ${props => props.theme.colorText}
  }
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
`;

const RewardButton = styled(Button)`
  && {
    margin-right: 10px;
  }
`;

export { ManageInventory };
