import React from 'react';

const initialState = {
  items: [],
  isFetching: false,
};

const LOAD_PHYSICAL_GOODS = 'LOAD_PHYSICAL_GOODS';
const LOAD_PHYSICAL_GOODS_SUCCESS = 'LOAD_PHYSICAL_GOODS_SUCCESS';
const LOAD_PHYSICAL_GOODS_FAIL = 'LOAD_PHYSICAL_GOODS_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PHYSICAL_GOODS:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_PHYSICAL_GOODS_SUCCESS:
      return {
        ...state,
        items: action.payload.filter(x => Boolean(x.price)),
        isFetching: false,
      };
    case LOAD_PHYSICAL_GOODS_FAIL:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const usePhysicalGoods = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const load = React.useCallback(async () => {
    dispatch({ type: LOAD_PHYSICAL_GOODS });
    try {
      const goods = await api.physicalGoodApi.loadPhysicalGoods();
      dispatch({ type: LOAD_PHYSICAL_GOODS_SUCCESS, payload: goods });
    } catch (error) {
      const errorMsg = error.response ? error.response.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_PHYSICAL_GOODS_FAIL });
    }
  }, [api.physicalGoodApi, notify]);

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
