import React from 'react';

const initialState = {
  isBuying: false,
  item: null,
}

const ADD_TO_CART = 'ADD_TO_CART';
const CLEAR_CART = 'CLEAR_CART';

const BUT_BY_VC = 'BUT_BY_VC';
const BUT_BY_VC_SUCCESS = 'BUT_BY_VC_SUCCESS';
const BUT_BY_VC_FAIL = 'BUT_BY_VC_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        item: action.payload,
      };

    case CLEAR_CART:
      return {
        ...state,
        item: null,
      };
      
    case BUT_BY_VC:
      return {
        ...state,
        isBuying: true,
      }
    case BUT_BY_VC_SUCCESS:
      return {
        ...state,
        item: null,
        isBuying: false,
      }
    case BUT_BY_VC_FAIL:
      return {
        ...state,
        isBuying: false,
      }

    default:
      return state;
  }
}

export const useVCCart = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const addItem = React.useCallback(item => dispatch({ type: ADD_TO_CART, payload: item }), []);
  const clearCart = React.useCallback(() => dispatch({ type: CLEAR_CART }), []);

  const buyByVirtualCurrencies = React.useCallback(async () => {
    const item = state.item;
    try {
      dispatch({ type: BUT_BY_VC });
      await api.cartApi.quickPurchaseByVirtualCurrency(item.sku, item.virtualPrice.sku);
      notify(`Purchased: ${item.name}`, { variant: 'success' });
      dispatch({ type: BUT_BY_VC_SUCCESS });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: BUT_BY_VC_FAIL });
    };
  }, [api.cartApi, notify, state.item]);

  return React.useMemo(() => [
    state,
    {
      addItem,
      clearCart,
      buyByVirtualCurrencies,
    }
  ], [state, addItem, clearCart, buyByVirtualCurrencies]);
}