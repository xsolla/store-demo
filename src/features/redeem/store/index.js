import React from 'react';

export const redeemStatuses = {
  SUCCESS: 'success',
  DEFAULT: 'default',
  REDEEMING: 'redeeming'
};

const initialState = {
  isShown: false,
  couponCode: '',
  redeemStatus: redeemStatuses.DEFAULT,
  redeemedItems: []
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
        redeemStatus: redeemStatuses.DEFAULT,
      };
    case HIDE_REDEEM:
      return {
        ...state,
        isShown: false,
      };
    case COUPON_REDEEM:
      return {
        ...state,
        redeemStatus: redeemStatuses.REDEEMING,
      };
    case COUPON_REDEEM_SUCCESS:
      return {
        ...state,
        couponCode: '',
        redeemStatus: redeemStatuses.SUCCESS,
        redeemedItems: action.payload
      };
    case COUPON_REDEEM_FAIL:
      return {
        ...state,
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
          const items = await api.redeemCouponApi.redeem(couponCode);
          dispatch({ type: COUPON_REDEEM_SUCCESS, payload: items });
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
