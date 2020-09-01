import React from 'react';
import {withRedeemModalWindow} from '../../../redux/container/redeem-modal-container';

import MUIModal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Grow from '@material-ui/core/Grow';

import styled from 'styled-components';
import {CouponCodeForm} from "./ui-component/coupon-code-form";

class Redeem extends React.Component {
  render() {
    const {isRedeemShown, closeRedeemModal} = this.props;

    return <Modal
      open={isRedeemShown}
      onClose={closeRedeemModal}
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
const Modal = styled(MUIModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;


export const RedeemModalWindow = withRedeemModalWindow(Redeem);
