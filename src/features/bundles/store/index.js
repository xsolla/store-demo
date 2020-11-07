import React from 'react';

const initialState = {
  bundles: [],
  isFetching: false,
};

const LOAD_BUNDLES = 'LOAD_BUNDLES';
const LOAD_BUNDLES_SUCCESS = 'LOAD_BUNDLES_SUCCESS';
const LOAD_BUNDLES_FAIL = 'LOAD_BUNDLES_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_BUNDLES:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_BUNDLES_SUCCESS:
      return {
        ...state,
        bundles: action.payload,
        isFetching: false,
      };
    case LOAD_BUNDLES_FAIL:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export const useBundles = ({ bundleApi }, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  
  const load = React.useCallback(async () => {
    dispatch({ type: LOAD_BUNDLES });
    try {
      const bundles = await bundleApi.loadBundles();
      dispatch({ type: LOAD_BUNDLES_SUCCESS, payload: bundles });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_BUNDLES_FAIL });
    }
  }, [bundleApi, notify]);

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
