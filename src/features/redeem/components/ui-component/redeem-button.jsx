import React from 'react';
import Button from '@material-ui/core/Button';

import { CircularProgress } from '@material-ui/core';

class RedeemButtonComponent extends React.Component {
  render() {
    const { isRedeeming, buttonText } = this.props;

    return (
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        disabled={isRedeeming}
      >
        {isRedeeming ? <CircularProgress size={24} color="primary"/> : buttonText }
      </Button>
    );
  }
}

export const RedeemButton = RedeemButtonComponent;