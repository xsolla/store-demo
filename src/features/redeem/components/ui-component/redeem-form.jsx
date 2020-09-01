import React from 'react';
import styled from 'styled-components';
import MUITextField from "@material-ui/core/TextField";

class RedeemForm extends React.PureComponent {
  render() {
    const {value} = this.props

    return (
      <TextField
        color="primary"
        placeholder="Enter your coupon code, for example: WINTER2021, GAMEBONUS2020"
        value={value}>
      </TextField>
    );
  }
}

export default RedeemForm;

const TextField = styled(MUITextField)`
  && {
    width: 100%;
    margin-bottom: 20px;
  }
`;