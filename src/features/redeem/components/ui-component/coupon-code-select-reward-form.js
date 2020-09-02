import React from 'react';

import { CouponCodeFormHeader } from './coupon-code-form-header';
import { CouponCodeFormFooter } from './coupon-code-form-footer';
import { CouponRedeemRewards } from './coupon-redeem-rewards';
import { Form } from '../style/redeem-style';

class CouponCodeSelectRewardFormComponent extends React.PureComponent {
  getHeaderText(isRedeemSuccess) {
    return isRedeemSuccess ? "You received the following items" : "Redeem coupon";
  }

  render() {
    const {isRedeeming, onSubmit, onChange, onClick} = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        onChange={onChange}
      >
        <CouponCodeFormHeader headerText={"Choose your bonus"} onClick={onClick}/>
        <CouponRedeemRewards />
        <CouponCodeFormFooter isPreloader={isRedeeming}/>
      </Form>
    );
  }
}

export const CouponCodeSelectRewardForm = CouponCodeSelectRewardFormComponent;