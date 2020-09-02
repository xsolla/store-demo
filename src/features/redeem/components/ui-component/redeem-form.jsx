import React from 'react';

import { TextField } from "../style/redeem-style";

class RedeemForm extends React.PureComponent {
  render() {
    const {value} = this.props

    return (
      <TextField
        color="primary"
        placeholder="Enter your coupon code, for example: WINTER2021, GAMEBONUS2020"
        value={value}
        autoFocus={true}
      >
      </TextField>
    );
  }
}

export default RedeemForm;

