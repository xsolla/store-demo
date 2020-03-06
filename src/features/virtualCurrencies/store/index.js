import React from 'react';

const initialState = {
  items: [],
  isFetching: false,
}

const LOAD_VIRTUAL_CURRENCIES = 'LOAD_VIRTUAL_CURRENCIES';
const LOAD_VIRTUAL_CURRENCIES_SUCCESS = 'LOAD_VIRTUAL_CURRENCIES_SUCCESS';
const LOAD_VIRTUAL_CURRENCIES_FAIL = 'LOAD_VIRTUAL_CURRENCIES_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_VIRTUAL_CURRENCIES:
      return {
        ...state,
        isFetching: true,
      }
    case LOAD_VIRTUAL_CURRENCIES_SUCCESS:
      return {
        ...state,
        items: action.payload,
        isFetching: false
      }
    case LOAD_VIRTUAL_CURRENCIES_FAIL:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state;
  };
};

export const useVirtualCurrencies = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const load = React.useCallback(async () => {
    dispatch({ type: LOAD_VIRTUAL_CURRENCIES });
    try {
      const items = await api.virtualCurrenciesApi.loadVirtualCurrencies();
      dispatch({ type: LOAD_VIRTUAL_CURRENCIES_SUCCESS, payload: items });
    } catch (error) {
      const errorMsg = error.response ? error.response.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_VIRTUAL_CURRENCIES_FAIL });
    }
  }, [api.virtualCurrenciesApi, notify]);


  return React.useMemo(() => [
    state,
    {
      load,
    }
  ], [load, state]);
}