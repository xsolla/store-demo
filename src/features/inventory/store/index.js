import React from 'react';

const initialState = {
  items: [],
  isFetching: false,
  isConsuming: false,
};

const LOAD_INVENTORY_ITEMS = 'LOAD_INVENTORY_ITEMS';
const LOAD_INVENTORY_ITEMS_SUCCESS = 'LOAD_INVENTORY_ITEMS_SUCCESS';
const LOAD_INVENTORY_ITEMS_FAIL = 'LOAD_INVENTORY_ITEMS_FAIL';

const CONSUME_ITEM = 'CONSUME_ITEM';
const CONSUME_ITEM_SUCCESS = 'CONSUME_ITEM_SUCCESS';
const CONSUME_ITEM_FAIL = 'CONSUME_ITEM_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_INVENTORY_ITEMS:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_INVENTORY_ITEMS_SUCCESS:
      return {
        ...state,
        items: action.payload,
        isFetching: false,
      };
    case LOAD_INVENTORY_ITEMS_FAIL:
      return {
        ...state,
        isFetching: false,
      };
    case CONSUME_ITEM:
      return {
        ...state,
        isConsuming: true,
      };
    case CONSUME_ITEM_SUCCESS: {
      const updateInventoryItemIndex = state.items.findIndex(x => x.sku === action.payload);
      const updatedInventoryItem = state.items[updateInventoryItemIndex];
      const newInventoryItems =
        updatedInventoryItem.quantity > 1
          ? [
              ...state.items.slice(0, updateInventoryItemIndex),
              {
                ...updatedInventoryItem,
                quantity: updatedInventoryItem.quantity - 1,
              },
              ...state.items.slice(updateInventoryItemIndex + 1),
            ]
          : [
              ...state.items.slice(0, updateInventoryItemIndex),
              ...state.items.slice(updateInventoryItemIndex + 1),
            ];
      return {
        ...state,
        items: newInventoryItems,
        isConsuming: false,
      };
    }
    case CONSUME_ITEM_FAIL:
      return {
        ...state,
        isConsuming: false,
      };
    default:
      return state;
  }
};

export const useInventory = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const load = React.useCallback(async () => {
    dispatch({ type: LOAD_INVENTORY_ITEMS });
    try {
      const items = await api.inventoryApi.loadInventory();
      dispatch({ type: LOAD_INVENTORY_ITEMS_SUCCESS, payload: items });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_INVENTORY_ITEMS_FAIL });
    }
  }, [api.inventoryApi, notify]);

  const consume = React.useCallback(
    async item => {
      dispatch({ type: CONSUME_ITEM });
      try {
        await api.inventoryApi.consumeItem(item.sku, item.instanceId);
        dispatch({ type: CONSUME_ITEM_SUCCESS, payload: item.sku });
        notify(`"${item.name}" is consumed`, { variant: 'info' });
      } catch (error) {
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        notify(errorMsg, { variant: 'error' });
        dispatch({ type: CONSUME_ITEM_FAIL });
      }
    },
    [api.inventoryApi, notify]
  );

  return React.useMemo(
    () => [
      state,
      {
        load,
        consume,
      },
    ],
    [consume, load, state]
  );
};
