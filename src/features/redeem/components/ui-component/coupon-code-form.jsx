import React from 'react';
import styled from 'styled-components';
import {device} from '../../../../styles/devices';
import {withRedeemForm} from "../../../../redux/container/redeem-form-container";
import {withRedeemModalWindow} from "../../../../redux/container/redeem-modal-container";
import {CouponCodeRedeemForm} from "./coupon-code-redeem-form";
import {CouponCodeSelectRewardForm} from "./coupon-code-select-reward-form";

class CouponCodeFormComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      couponCode: ''
    }
  }

  isRedeemSuccess() {
    const {isRedeemSuccess} = this.props;
    return isRedeemSuccess === true;
  }

  getHandleSubmit() {
    return this.isRedeemSuccess()
      ? this.handleSubmitCloseForm
      : this.handleSubmitForm
  }

  handleSubmitCloseForm(event) {
    console.log("CLOSE");
    const {closeRedeemModal, clearCouponForm} = this.props;
    event.preventDefault();
    closeRedeemModal();
    clearCouponForm();
  }

  handleSubmitForm(event) {
    event.preventDefault();
    const {getCouponRewards, redeemApi} = this.props;
    const {couponCode} = this.state;
    getCouponRewards(couponCode, redeemApi);
  }

  handleRedeemForm(event) {
    event.preventDefault();
    const {redeemCoupon, redeemApi, selectedReward} = this.props;
    const {couponCode} = this.state;
    redeemCoupon(couponCode, selectedReward, redeemApi);
  }

  handleChangeForm(event) {
    this.setState({
      couponCode: event.target.value
    })
  }

  render() {
    const {couponCode} = this.state;
    const {isRedeeming, isSelectIsNeeded, areRewardsGetting} = this.props;
    return (
      <RedeemContent tabIndex={-1}>
        {
          isSelectIsNeeded
            ?
            <CouponCodeSelectRewardForm
              onSubmit={this.handleRedeemForm.bind(this)}
              onChange={this.handleChangeForm.bind(this)}
              onClick={this.handleSubmitCloseForm.bind(this)}
              isRedeeming={isRedeeming} />
            :
            <CouponCodeRedeemForm
              onSubmit={this.getHandleSubmit().bind(this)}
              onChange={this.handleChangeForm.bind(this)}
              isRedeemSuccess={this.isRedeemSuccess()}
              couponCode={couponCode}
              areRewardsGetting={areRewardsGetting}
              onClick={this.handleSubmitCloseForm.bind(this)} />
        }

      </RedeemContent>
    );
  }
}

export const CouponCodeForm = withRedeemModalWindow(withRedeemForm(CouponCodeFormComponent));

const RedeemContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({theme}) => `${theme.shape.borderRadius}px`};
  background-color: ${({theme}) => theme.palette.background.default};
  color: ${({theme}) => theme.palette.text.primary};
  padding: 0 32px;
  width: 680px;
  max-height: 80vh;
  outline: none;

  @media ${device.tablet} {
    padding: 0 16px;
    max-height: none;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

const Form = styled.form`
  max-width: auto;
  width: 100%;
  padding: 20px;
`;