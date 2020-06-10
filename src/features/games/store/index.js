import React from 'react';

// Action types
const LOAD_GAMES = 'LOAD_GAMES';
const LOAD_GAMES_SUCCESS = 'LOAD_GAMES_SUCCESS';
const LOAD_GAMES_FAIL = 'LOAD_GAMES_FAIL';

// Reducers
const initialState = {
  items: [],
  isFetching: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOAD_GAMES:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_GAMES_SUCCESS:
      return {
        ...state,
        items: action.payload,
        isFetching: false,
      };
    case LOAD_GAMES_FAIL:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

// Actions
export const useGames = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const load = React.useCallback(async () => {
    dispatch({type: LOAD_GAMES});
    try {
      const items = await api.gamesApi.loadList();
      dispatch({type: LOAD_GAMES_SUCCESS, payload: items});
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, {variant: 'error'});
      dispatch({type: LOAD_GAMES_FAIL});
    }
  }, [api.gamesApi, notify]);

  return [
    state,
    {
      load,
    }
  ];
};
