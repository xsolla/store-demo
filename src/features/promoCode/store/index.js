import React from 'react';

const initialState = {
  promoCode: ''
};

const SET_PROMO_CODE = 'SET_PROMO_CODE';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_PROMO_CODE:
      return {
        ...state,
        promoCode: action.payload
      };
    default:
      return state;
  }
};

export const usePromoCode = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const setPromoCode = React.useCallback(
      (promoCode) => dispatch({ type: SET_PROMO_CODE, payload: promoCode }), []
  );

  return React.useMemo(
    () => [
      state,
      {
        setPromoCode,
      },
    ],
    [setPromoCode, state]
  );
};
