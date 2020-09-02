import React from 'react';

import { RedeemButton } from './redeem-button';
import { withRedeemForm } from '../../../../redux/container/redeem-form-container';
import { RedeemActions, RedeemFooter } from '../style/redeem-style';

class CouponCodeFormFooterComponent extends React.PureComponent {
  isSuccessRedeem() {
    const {isRedeemSuccess} = this.props;
    return isRedeemSuccess === true;
  }

  render() {
    const {isPreloader, isRedeeming} = this.props;
    const buttonText = this.isSuccessRedeem() ? "Ok" : "Redeem";

    return (
      <RedeemFooter>
        <RedeemActions>
          <RedeemButton isRedeeming={isPreloader || isRedeeming} buttonText={buttonText} />
        </RedeemActions>
      </RedeemFooter>
    );
  }
}

export const CouponCodeFormFooter = withRedeemForm(CouponCodeFormFooterComponent);

