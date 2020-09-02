import {
  SET_REDEEM_API,
  COUPON_REDEEM,
  COUPON_REDEEM_SUCCESS,
  COUPON_REDEEM_FAIL,
  RedeemStart,
  RedeemFail,
  RedeemSuccess,
  COUPON_CLEAR_FORM,
  CouponRewardsStart,
  CouponRewardsSuccess,
  CouponRewardsFail, COUPON_REWARDS_FAIL, COUPON_REWARDS_START, COUPON_REWARDS_SUCCESS, COUPON_SELECTED_REWARD,
} from '../action/redeem-form-action';
import SnackbarUtils from "../../components/snackbar-utils";

const defaultState = {
  redeemApi: () => {},
  isRedeeming: false,
  isRedeemSuccess: null,
  areRewardsGot: null,
  items: [],
  rewards: [],
  areRewardsGetting: false,
  isSelectIsNeeded: false,
  selectedReward: {}
}

export const RedeemFormReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SET_REDEEM_API:
      return {
        ...state,
        redeemApi: action.redeemApi
      }
    case COUPON_REWARDS_START:
      return {
        ...state,
        areRewardsGetting: true
      }
    case COUPON_REDEEM:
      return {
        ...state,
        isRedeeming: true
      }
    case COUPON_REWARDS_SUCCESS:
      let isSelectIsNeeded = false;
      if (action.payload && action.payload.length > 0) {
        isSelectIsNeeded = true;
      }

      return {
        ...state,
        areRewardsGetting: false,
        areRewardsGot: true,
        rewards: action.payload,
        isSelectIsNeeded: isSelectIsNeeded
      }
    case COUPON_REDEEM_SUCCESS:
      return {
        ...state,
        isRedeeming: false,
        isRedeemSuccess: true,
        items: action.payload,
        isSelectIsNeeded: false
      }
    case COUPON_REDEEM_FAIL:
      return {
        ...state,
        isRedeeming: false,
        isRedeemSuccess: false,
      }
    case COUPON_REWARDS_FAIL:
      return {
        ...state,
        areRewardsGetting: false,
        areRewardsGot: false,
      }
    case COUPON_SELECTED_REWARD:
      return {
        ...state,
        selectedReward: action.payload
      }
    case COUPON_CLEAR_FORM:
      return {
        ...state,
        isRedeeming: false,
        isRedeemSuccess: null,
        items: [],
        rewards: [],
        areRewardsGetting: false,
        areRewardsGot: null,
        isSelectIsNeeded: false,
        selectedReward: {}
      }
    default:
      return state;
  }
}

export const redeemCoupon = (dispatch) => (couponCode, selectedReward, action) => {
  dispatch(RedeemStart());

  return action.redeem(couponCode, selectedReward)
    .then((items) => dispatch(RedeemSuccess(items)))
    .catch((error) => {
      const errorMessage = error.response ? error.response.data.errorMessage : error.message;
      SnackbarUtils.notifyError(errorMessage)
      dispatch(RedeemFail())
    });
}

export const getCouponRewards = (dispatch) => (couponCode, action) => {
  dispatch(CouponRewardsStart());

  return action.rewards(couponCode)
    .then((items) => {
      dispatch(CouponRewardsSuccess(items));
      if (items.length === 0) {
        redeemCoupon(dispatch)(couponCode, null, action);
      }
    })
    .catch((error) => {
      const errorMessage = error.response ? error.response.data.errorMessage : error.message;
      SnackbarUtils.notifyError(errorMessage)
      dispatch(CouponRewardsFail())
    });
}