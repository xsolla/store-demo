import {connect} from 'react-redux';

import {
  SetRedeemApi,
  ClearCouponForm, SetSelectedReward
} from '../action/redeem-form-action';

import {
  redeemCoupon,
  getCouponRewards
} from '../reducer/redeem-form-reducer'

const mapStateToProps = (state) => (
  {
    redeemApi: state.redeem_form.redeemApi,
    isRedeeming: state.redeem_form.isRedeeming,
    isRedeemSuccess: state.redeem_form.isRedeemSuccess,
    items: state.redeem_form.items,
    rewards: state.redeem_form.rewards,
    areRewardsGetting: state.redeem_form.areRewardsGetting,
    areRewardsGot: state.redeem_form.areRewardsGot,
    isSelectIsNeeded: state.redeem_form.isSelectIsNeeded,
    selectedReward: state.redeem_form.selectedReward
  }
);

export const mapDispatchToProps = (dispatch) => {
  return {
    setRedeemApi: (api) => {dispatch(SetRedeemApi(api))},
    clearCouponForm: () => {dispatch(ClearCouponForm())},
    redeemCoupon: redeemCoupon(dispatch),
    getCouponRewards: getCouponRewards(dispatch),
    setSelectedReward: (selectedReward) => {dispatch(SetSelectedReward(selectedReward))}
  }
}

export const withRedeemForm = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {forwardRef: true}
);