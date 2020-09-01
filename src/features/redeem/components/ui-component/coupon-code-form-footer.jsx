import React from 'react';
import styled from 'styled-components';
import Colorer from 'color';
import {RedeemButton} from "./redeem-button";
import {withRedeemForm} from "../../../../redux/container/redeem-form-container";

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

const RedeemFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  border-top: 1px solid
    ${({ theme }) =>
      Colorer(theme.palette.text.primary)
        .alpha(0.1)
        .string()};
  padding: 24px 0 24px 0;
`;

const RedeemActions = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 7px;
`;
