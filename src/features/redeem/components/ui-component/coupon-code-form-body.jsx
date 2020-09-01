import React from 'react';
import styled from 'styled-components';
import RedeemForm from "./redeem-form";
import {CouponRedeemResult} from "./coupon-redeem-result";

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

const RedeemBody = styled.div`
  display: grid;
  grid-row-gap: 30px;
  flex-grow: 1;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;