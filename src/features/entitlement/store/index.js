import React from 'react';

const initialState = {
  items: [],
  isFetching: false,
  isRedeeming: false,
};

const LOAD_ENTITLEMENT = 'LOAD_ENTITLEMENT';
const LOAD_ENTITLEMENT_SUCCESS = 'LOAD_ENTITLEMENT_SUCCESS';
const LOAD_ENTITLEMENT_FAIL = 'LOAD_ENTITLEMENT_FAIL';

const REDEEM = 'REDEEM';
const REDEEM_SUCCESS = 'REDEEM_SUCCESS';
const REDEEM_FAIL = 'REDEEM_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_ENTITLEMENT:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_ENTITLEMENT_SUCCESS:
      return {
        ...state,
        items: action.payload,
        isFetching: false,
      };
    case LOAD_ENTITLEMENT_FAIL:
      return {
        ...state,
        isFetching: false,
      };

    case REDEEM:
      return {
        ...state,
        isRedeeming: true,
      };
    case REDEEM_SUCCESS:
      return {
        ...state,
        isRedeeming: false,
      };
    case REDEEM_FAIL:
      return {
        ...state,
        isRedeeming: false,
      };
    default:
      return state;
  }
};

export const useEntitlement = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const load = React.useCallback(async () => {
    dispatch({ type: LOAD_ENTITLEMENT });
    try {
      const items = await api.entitlementApi.loadEntitlement();
      dispatch({ type: LOAD_ENTITLEMENT_SUCCESS, payload: items });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_ENTITLEMENT_FAIL });
    }
  }, [api.entitlementApi, notify]);

  const redeem = React.useCallback(
    async (code, sku) => {
      dispatch({ type: REDEEM });
      try {
        await api.entitlementApi.redeem(code, sku);
        load();
        dispatch({ type: REDEEM_SUCCESS });
      } catch (error) {
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        notify(errorMsg, { variant: 'error' });
        dispatch({ type: REDEEM_FAIL });
      }
    },
    [api.entitlementApi, load, notify]
  );

  return React.useMemo(
    () => [
      state,
      {
        load,
        redeem,
      },
    ],
    [load, redeem, state]
  );
};
