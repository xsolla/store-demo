import React from 'react';
import styled from 'styled-components';

import MUITextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

import { useStore } from '../../../store';
import { GroupSwitcher } from '../../../components/GroupSwitcher';
import { Preloader } from '../../../components/Preloader.js';

const mapState = state => ({
  users: state.manageInventory.users,
  groups: state.manageInventory.groups,
  virtualItems: state.manageInventory.virtualItems,
  virtualCurrencies: state.manageInventory.virtualCurrencies,
  isRewarding: state.manageInventory.isRewarding,
  isRevoking: state.manageInventory.isRevoking,
  isLoading:
    state.manageInventory.areVirtualCurrenciesLoading || state.manageInventory.areVirtualItemsLoading,
});

const mapActions = actions => ({
  rewardItems: actions.manageInventory.rewardItems,
  revokeItems: actions.manageInventory.revokeItems,
  loadVirtualItems: actions.manageInventory.loadVirtualItems,
  loadVirtualCurrencies: actions.manageInventory.loadVirtualCurrencies,
});

const ManageInventory = React.memo(() => {
  const {
    users,
    groups,
    virtualItems,
    virtualCurrencies,
    isRewarding,
    isRevoking,
    isLoading,
    rewardItems,
    revokeItems,
    loadVirtualItems,
    loadVirtualCurrencies,
  } = useStore(mapState, mapActions);

  const [userID, setUserID] = React.useState('');
  const [activeGroup, setActiveGroup] = React.useState('');
  const [selectedItem, setSelectedItem] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);

  const userOptions = React.useMemo(() => users.map(x => <MenuItem value={x.id}>{x.name}</MenuItem>), [
    users,
  ]);

  const virtualItemsOptions = React.useMemo(
    () => virtualItems.map(x => <MenuItem value={x.sku}>{x.name}</MenuItem>),
    [virtualItems]
  );

  const currenciesOptions = React.useMemo(
    () => virtualCurrencies.map(x => <MenuItem value={x.sku}>{x.name}</MenuItem>),
    [virtualCurrencies]
  );

  const groupsContent = React.useMemo(
    () => ({
      items: {
        name: 'Item',
        items: virtualItems,
        options: virtualItemsOptions,
      },
      currencies: {
        name: 'Currency',
        items: virtualCurrencies,
        options: currenciesOptions,
      },
    }),
    [currenciesOptions, virtualItemsOptions, virtualCurrencies, virtualItems]
  );

  const handleRewardItem = React.useCallback(() => {
    rewardItems(userID, selectedItem, quantity);
  }, [quantity, rewardItems, selectedItem, userID]);

  const handleRevokeItem = React.useCallback(() => {
    revokeItems(userID, selectedItem, quantity);
  }, [quantity, revokeItems, selectedItem, userID]);

  const handleFormSubmit = React.useCallback(event => event.preventDefault(), []);
  const handleUserSelect = React.useCallback(event => setUserID(event.target.value), []);
  const handleItemSelect = React.useCallback(event => setSelectedItem(event.target.value), []);
  const handleQuantityChange = React.useCallback(
    event => setQuantity(Number(event.target.value) >= 1 ? Number(event.target.value) : 1),
    []
  );

  React.useEffect(() => {
    setUserID(users[0] ? users[0].id : null);
  }, []);

  React.useEffect(() => {
    setActiveGroup(groups[0] ? groups[0].id : null);
  }, []);

  React.useEffect(() => {
    if (activeGroup && groupsContent[activeGroup] && groupsContent[activeGroup].items[0]) {
      setSelectedItem(groupsContent[activeGroup].items[0].sku);
      setQuantity(1);
    }
  }, [activeGroup, groupsContent]);

  React.useEffect(() => {
    loadVirtualItems();
  }, []);

  React.useEffect(() => {
    loadVirtualCurrencies();
  }, []);

  return React.useMemo(
    () => (
      <Body>
        {isLoading ? (
          <Preloader />
        ) : (
          <Form onSubmit={handleFormSubmit}>
            <TextField select label="User" value={userID} color="primary" onChange={handleUserSelect}>
              {userOptions}
            </TextField>
            <GroupSwitcher groups={groups} activeGroup={activeGroup} onGroupChange={setActiveGroup} />
            <Items>
              {groupsContent[activeGroup] && (
                <TextField
                  select
                  label={groupsContent[activeGroup].name}
                  value={selectedItem}
                  color="primary"
                  onChange={handleItemSelect}>
                  {groupsContent[activeGroup].options}
                </TextField>
              )}
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                color="primary"
                onChange={handleQuantityChange}
              />
            </Items>
            <FormFooter>
              <FormActions>
                <RewardButton variant="contained" disabled={isRewarding} onClick={handleRewardItem}>
                  {isRewarding ? <CircularProgress size={24} color="primary" /> : 'Reward'}
                </RewardButton>
                <Button variant="contained" disabled={isRevoking} onClick={handleRevokeItem}>
                  {isRevoking ? <CircularProgress size={24} color="primary" /> : 'Revoke'}
                </Button>
              </FormActions>
            </FormFooter>
          </Form>
        )}
      </Body>
    ),
    [
      activeGroup,
      groups,
      groupsContent,
      handleFormSubmit,
      handleItemSelect,
      handleQuantityChange,
      handleRevokeItem,
      handleRewardItem,
      handleUserSelect,
      isLoading,
      isRevoking,
      isRewarding,
      quantity,
      selectedItem,
      userID,
      userOptions,
    ]
  );
});

const Body = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 50px;
`;

const Form = styled.form`
  max-width: 400px;
  width: 100%;
  padding: 20px;
`;

const TextField = styled(MUITextField)`
  width: 100%;
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 20px;
`;

const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
`;

const FormActions = styled.div`
  position: relative;
`;

const RewardButton = styled(Button)`
  && {
    margin-right: 10px;
  }
`;

export { ManageInventory };
