import React from 'react';
import {CouponCodeFormHeader} from "./coupon-code-form-header";
import {CouponCodeFormBody} from "./coupon-code-form-body";
import {CouponCodeFormFooter} from "./coupon-code-form-footer";
import styled from "styled-components";

class CouponCodeRedeemFormComponent extends React.PureComponent {
  getHeaderText(isRedeemSuccess) {
    return isRedeemSuccess ? "You received the following items" : "Redeem coupon";
  }

  render() {
    const {isRedeemSuccess, couponCode, areRewardsGetting, onSubmit, onChange, onClick} = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        onChange={onChange}
      >
        <CouponCodeFormHeader
          headerText={this.getHeaderText(isRedeemSuccess)}
          onClick={onClick}
        />

        <CouponCodeFormBody isRedeemSuccess={isRedeemSuccess} couponCode={couponCode}/>
        <CouponCodeFormFooter isPreloader={areRewardsGetting}/>
      </Form>
    );
  }
}

export const CouponCodeRedeemForm = CouponCodeRedeemFormComponent;

const Form = styled.form`
  max-width: auto;
  width: 100%;
  padding: 20px;
`;