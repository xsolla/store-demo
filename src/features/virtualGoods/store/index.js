import React from 'react';

const initialState = {
  groups: [],
  isFetching: false,
};

const LOAD_VIRTUAL_GOODS = 'LOAD_VIRTUAL_GOODS';
const LOAD_VIRTUAL_GOODS_SUCCESS = 'LOAD_VIRTUAL_GOODS_SUCCESS';
const LOAD_VIRTUAL_GOODS_FAIL = 'LOAD_VIRTUAL_GOODS_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_VIRTUAL_GOODS:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_VIRTUAL_GOODS_SUCCESS:
      return {
        ...state,
        groups: action.payload,
        isFetching: false,
      };
    case LOAD_VIRTUAL_GOODS_FAIL:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const useVirtualGoods = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const load = React.useCallback(async () => {
    dispatch({ type: LOAD_VIRTUAL_GOODS });
    try {
      const groups = await api.virtualGoodsApi.loadVirtualItems();
      dispatch({ type: LOAD_VIRTUAL_GOODS_SUCCESS, payload: groups });
    } catch (error) {
      const errorMsg = error.response ? error.response.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_VIRTUAL_GOODS_FAIL });
    }
  }, [api.virtualGoodsApi, notify]);

  return React.useMemo(
    () => [
      state,
      {
        load,
      },
    ],
    [load, state]
  );
};
