export const SET_REDEEM_API = 'SET_REDEEM_API';

export const COUPON_REDEEM = 'COUPON_REDEEM';
export const COUPON_REDEEM_SUCCESS = 'COUPON_REDEEM_SUCCESS';
export const COUPON_REDEEM_FAIL = 'COUPON_REDEEM_FAIL';
export const COUPON_CLEAR_FORM = 'COUPON_CLEAR_FROM';

export const COUPON_REWARDS_START = 'COUPON_REWARDS_START';
export const COUPON_REWARDS_SUCCESS = 'COUPON_REWARDS_SUCCESS';
export const COUPON_REWARDS_FAIL = 'COUPON_REWARDS_FAIL';
export const COUPON_SELECTED_REWARD = 'COUPON_SELECTED_BONUS';

export const SetRedeemApi = (api) => {
  return {
    type: SET_REDEEM_API,
    redeemApi: api
  }
};

export const RedeemSuccess = (payload) => {
  return {type: COUPON_REDEEM_SUCCESS, payload: payload}
};

export const RedeemFail = () => {
  return {type: COUPON_REDEEM_FAIL}
};

export const RedeemStart = () => {
  return {type: COUPON_REDEEM}
};

export const ClearCouponForm = () => {
  return {type: COUPON_CLEAR_FORM}
}

export const CouponRewardsStart = () => {
  return {type: COUPON_REWARDS_START}
}
export const CouponRewardsSuccess = (payload) => {
  return {type: COUPON_REWARDS_SUCCESS, payload: payload}
}
export const CouponRewardsFail = () => {
  return {type: COUPON_REWARDS_FAIL}
}

export const SetSelectedReward = (selectedReward) => {
  return {type: COUPON_SELECTED_REWARD, payload: selectedReward}
}