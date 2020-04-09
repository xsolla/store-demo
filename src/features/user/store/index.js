import React from 'react';

const initialState = {
  userInfo: null,
  token: null,
  balances: [],
  areBalancesLoading: false,
  isAuthenticating: false,
  isLogouting: false,
};

const LOAD_USER_BALANCE = 'LOAD_USER_BALANCE';
const LOAD_USER_BALANCE_SUCCESS = 'LOAD_USER_BALANCE_SUCCESS';
const LOAD_USER_BALANCE_FAIL = 'LOAD_USER_BALANCE_FAIL';

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';

const LOGOUT = 'LOGOUT';
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'LOGOUT_FAIL';

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticating: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        isAuthenticating: false,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isAuthenticating: false,
      };

    case LOGOUT:
      return {
        ...state,
        isLogouting: true,
      };
    case LOGOUT_SUCCESS:
      return initialState;
    case LOGOUT_FAIL:
      return {
        ...state,
        isLogouting: false,
      };

    case LOAD_USER_BALANCE:
      return {
        ...state,
        areBalancesLoading: true,
      };
    case LOAD_USER_BALANCE_SUCCESS:
      return {
        ...state,
        balances: action.payload,
        areBalancesLoading: false,
      };
    case LOAD_USER_BALANCE_FAIL:
      return {
        ...state,
        areBalancesLoading: false,
      };
    default:
      return state;
  }
};

export const useUser = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getUser = React.useCallback(async () => {
    dispatch({ type: LOGIN });
    try {
      const userInfo = await api.userApi.getUser();
      dispatch({ type: LOGIN_SUCCESS, payload: userInfo });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOGIN_FAIL });
    }
  }, [api.userApi, notify]);

  const logout = React.useCallback(async () => {
    dispatch({ type: LOGOUT });
    try {
      await api.userApi.logout();
      dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOGOUT_FAIL });
    }
  }, [api.userApi, notify]);

  const loadBalances = React.useCallback(async () => {
    dispatch({ type: LOAD_USER_BALANCE });
    try {
      const balances = await api.userApi.loadBalances();
      dispatch({ type: LOAD_USER_BALANCE_SUCCESS, payload: balances });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: LOAD_USER_BALANCE_FAIL });
    }
  }, [api.userApi, notify]);

  return React.useMemo(
    () => [
      state,
      {
        getUser,
        loadBalances,
        logout,
      },
    ],
    [state, getUser, loadBalances, logout]
  );
};
