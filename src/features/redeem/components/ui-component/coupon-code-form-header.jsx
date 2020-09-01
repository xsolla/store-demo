import React from 'react';
import IconClose from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { RedeemHeader } from '../style/redeem-style';

class CouponCodeFormHeaderComponent extends React.Component {
  render() {
    const {onClick, headerText} = this.props;

    return (
      <RedeemHeader>
        <h4>{headerText}</h4>
        <IconButton color="inherit" onClick={onClick}>
          <IconClose/>
        </IconButton>
      </RedeemHeader>
    );
  }
}

export const CouponCodeFormHeader = CouponCodeFormHeaderComponent;

