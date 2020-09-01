import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Grow from '@material-ui/core/Grow';

import { CouponCodeForm } from "./ui-component/coupon-code-form";
import { withRedeemModalWindow } from '../../../redux/container/redeem-modal-container';
import { Modal } from './style/redeem-style';
import { withRedeemForm } from '../../../redux/container/redeem-form-container';

class Redeem extends React.Component {
  handleOnClose() {
    const {closeRedeemModal, clearCouponForm} = this.props;
    clearCouponForm();
    closeRedeemModal();
  }

  render() {
    const {isRedeemShown} = this.props;

    return <Modal
      open={isRedeemShown}
      onClose={this.handleOnClose.bind(this)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 250 }}
      >
      <Grow in={isRedeemShown} timeout={250}>
        <CouponCodeForm />
      </Grow>
  </Modal>;
  }
}

export const RedeemModalWindow = withRedeemModalWindow(withRedeemForm(Redeem));
