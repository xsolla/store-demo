import React from 'react';

const initialState = {
  isItemRevoking: false,
  isItemRewarding: false,
  areVirtualCurrenciesLoading: false,
  virtualCurrencies: [],
  areVirtualItemsLoading: false,
  virtualItems: [],
  users: [
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
  ],
  groups: [
    {
      id: 'items',
      label: 'Items',
    },
    {
      id: 'currencies',
      label: 'Currencies',
    },
  ],
};

const LOAD_VIRTUAL_ITEMS = 'LOAD_VIRTUAL_ITEMS';
const LOAD_VIRTUAL_ITEMS_SUCCESS = 'LOAD_VIRTUAL_ITEMS_SUCCESS';
const LOAD_VIRTUAL_ITEMS_FAIL = 'LOAD_VIRTUAL_ITEMS_FAIL';

const LOAD_VIRTUAL_CURRENCIES = 'LOAD_VIRTUAL_CURRENCIES';
const LOAD_VIRTUAL_CURRENCIES_SUCCESS = 'LOAD_VIRTUAL_CURRENCIES_SUCCESS';
const LOAD_VIRTUAL_CURRENCIES_FAIL = 'LOAD_VIRTUAL_CURRENCIES_FAIL';

const REWARD_ITEMS = 'REWARD_ITEMS';
const REWARD_ITEMS_SUCCESS = 'REWARD_ITEMS_SUCCESS';
const REWARD_ITEMS_FAIL = 'REWARD_ITEMS_FAIL';

const REVOKE_ITEMS = 'REVOKE_ITEMS';
const REVOKE_ITEMS_SUCCESS = 'REVOKE_ITEMS_SUCCESS';
const REVOKE_ITEMS_FAIL = 'REVOKE_ITEMS_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_VIRTUAL_ITEMS:
      return {
        ...state,
        areVirtualItemsLoading: true,
      };
    case LOAD_VIRTUAL_ITEMS_SUCCESS:
      return {
        ...state,
        virtualItems: action.payload,
        areVirtualItemsLoading: false,
      };
    case LOAD_VIRTUAL_ITEMS_FAIL:
      return {
        ...state,
        areVirtualItemsLoading: false,
      };

    case LOAD_VIRTUAL_CURRENCIES:
      return {
        ...state,
        areVirtualCurrenciesLoading: true,
      };
    case LOAD_VIRTUAL_CURRENCIES_SUCCESS:
      return {
        ...state,
        virtualCurrencies: action.payload,
        areVirtualCurrenciesLoading: false,
      };
    case LOAD_VIRTUAL_CURRENCIES_FAIL:
      return {
        ...state,
        areVirtualCurrenciesLoading: false,
      };

    case REWARD_ITEMS:
      return {
        ...state,
        isRewarding: true,
      };
    case REWARD_ITEMS_SUCCESS:
      return {
        ...state,
        isRewarding: false,
      };
    case REWARD_ITEMS_FAIL:
      return {
        ...state,
        isRewarding: false,
      };

    case REVOKE_ITEMS:
      return {
        ...state,
        isRevoking: true,
      };
    case REVOKE_ITEMS_SUCCESS:
      return {
        ...state,
        isRevoking: false,
      };
    case REVOKE_ITEMS_FAIL:
      return {
        ...state,
        isRevoking: false,
      };

    default:
      return state;
  }
};

export const useManageInventory = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const loadVirtualItems = React.useCallback(async () => {
    dispatch({ type: LOAD_VIRTUAL_ITEMS });
    try {
      const items = await api.inventoryApi.loadVirtualItems();
      dispatch({ type: LOAD_VIRTUAL_ITEMS_SUCCESS, payload: items });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_VIRTUAL_ITEMS_FAIL });
    }
  }, [api.inventoryApi, notify]);

  const loadVirtualCurrencies = React.useCallback(async () => {
    dispatch({ type: LOAD_VIRTUAL_CURRENCIES });
    try {
      const items = await api.inventoryApi.loadVirtualCurrencies();
      dispatch({ type: LOAD_VIRTUAL_CURRENCIES_SUCCESS, payload: items });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_VIRTUAL_CURRENCIES_FAIL });
    }
  }, [api.inventoryApi, notify]);

  const rewardItems = React.useCallback(
    async (user, item, count) => {
      dispatch({ type: REWARD_ITEMS });
      try {
        const data = { type: 'reward', user, item, count };
        const rewardData = await api.inventoryApi.rewardItems(data);
        notify(`User: '${rewardData.userId}' got '${rewardData.itemId}' in quantity ${rewardData.quantity}`, {
          variant: 'info',
        });
        dispatch({ type: REWARD_ITEMS_SUCCESS });
      } catch (error) {
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        notify(errorMsg, { variant: 'error' });
        dispatch({ type: REWARD_ITEMS_FAIL });
      }
    },
    [api.inventoryApi, notify]
  );

  const revokeItems = React.useCallback(
    async (user, item, count) => {
      dispatch({ type: REVOKE_ITEMS });
      try {
        const data = { type: 'revoke', user, item, count };
        const revokeData = await api.inventoryApi.rewardItems(data);
        notify(
          `User: '${revokeData.userId}' has lost '${revokeData.itemId}' in quantity ${revokeData.quantity}`,
          { variant: 'info' }
        );
        dispatch({ type: REVOKE_ITEMS_SUCCESS });
      } catch (error) {
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        notify(errorMsg, { variant: 'error' });
        dispatch({ type: REVOKE_ITEMS_FAIL });
      }
    },
    [api.inventoryApi, notify]
  );

  return React.useMemo(
    () => [
      state,
      {
        rewardItems,
        revokeItems,
        loadVirtualItems,
        loadVirtualCurrencies,
      },
    ],
    [state, loadVirtualItems, loadVirtualCurrencies, rewardItems, revokeItems]
  );
};
