import React from 'react';

const initialState = {
  isShown: false,
  isRedeeming: false,
  couponCode: null,
};

const SHOW_REDEEM = 'REDEEM_SHOW';
const HIDE_REDEEM = 'REDEEM_HIDE';
const COUPON_REDEEM = 'COUPON_REDEEM';

const COUPON_REDEEM_SUCCESS = 'COUPON_REDEEM_SUCCESS';
const COUPON_REDEEM_FAIL = 'COUPON_REDEEM_FAIL';

const SET_COUPON_CODE = 'SET_COUPON_CODE';

const reducer = (state, action) => {
  switch (action.type) {
    case SHOW_REDEEM:
      return {
        ...state,
        isShown: true,
      };
    case HIDE_REDEEM:
      return {
        ...state,
        isShown: false,
      };
    case COUPON_REDEEM:
      return {
        ...state,
        isRedeeming: true,
      };
    case COUPON_REDEEM_SUCCESS:
      return {
        ...state,
        isRedeeming: false,
        couponCode: null,
      };
    case COUPON_REDEEM_FAIL:
      return {
        ...state,
        isRedeeming: false,
      };
    case SET_COUPON_CODE:
      return {
        ...state,
        couponCode: action.payload
      };
    default:
      return state;
  }
};

export const useRedeem = (api, notify) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const show = React.useCallback(() => dispatch({ type: SHOW_REDEEM }), []);
  const hide = React.useCallback(() => dispatch({ type: HIDE_REDEEM }), []);
  const setCouponCode = React.useCallback(
      (couponCode) => dispatch({ type: SET_COUPON_CODE, payload: couponCode }), []
  );

  const redeem = React.useCallback(
      async (couponCode) => {
        dispatch({ type: COUPON_REDEEM });
        try {
          await api.redeemCouponApi.redeem(couponCode);
          dispatch({ type: COUPON_REDEEM_SUCCESS });
        } catch (error) {
          const errorMsg = error.response ? error.response.data.errorMessage : error.message;
          notify(errorMsg, { variant: 'error' });
          dispatch({ type: COUPON_REDEEM_FAIL });
        }
      },
      [api.redeemCouponApi, notify]
  );

  return React.useMemo(
    () => [
      state,
      {
        show,
        hide,
        redeem,
        setCouponCode,
      },
    ],
    [hide, show, redeem, setCouponCode, state]
  );
};
