import React from 'react';

import RedeemForm from "./redeem-form";
import { CouponRedeemResult } from './coupon-redeem-result';
import { RedeemBody } from '../style/redeem-style';

class CouponCodeFormBodyComponent extends React.PureComponent {
  render() {
    const {couponCode, isRedeemSuccess} = this.props

    return (
      <div>
        <RedeemBody>
          {
            isRedeemSuccess
              ? <CouponRedeemResult />
              : <RedeemForm value={couponCode}/>
          }
        </RedeemBody>
      </div>
    );
  }
}

export const CouponCodeFormBody = CouponCodeFormBodyComponent;
