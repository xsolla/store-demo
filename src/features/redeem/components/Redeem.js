import React from 'react';
import styled from 'styled-components';
import Colorer from 'color';
import IconClose from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import MUIModal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Backdrop from '@material-ui/core/Backdrop';

import { useStore } from '../../../store';
import { device } from '../../../styles/devices';
import CircularProgress from "@material-ui/core/CircularProgress";
import MUITextField from "@material-ui/core/TextField";

const mapState = state => ({
  isRedeemShown: state.redeemCoupon.isShown,
  isRedeeming: state.redeemCoupon.isRedeeming,
  couponCode: state.redeemCoupon.couponCode,
});

const mapActions = actions => ({
  hideRedeem: actions.redeemCoupon.hide,
  redeem: actions.redeemCoupon.redeem,
  setCouponCode: actions.redeemCoupon.setCouponCode,
});

const Redeem = React.memo(() => {
  const {
    isRedeemShown,
    hideRedeem,
    redeem,
    isRedeeming,
    couponCode,
    setCouponCode,
  } = useStore(mapState, mapActions);
  const handleCouponCodeChange = React.useCallback(event => setCouponCode(event.target.value), []);

  const handleSubmit = React.useCallback(
      event => {
        event.preventDefault();
        redeem(couponCode);
      },
      [redeem, couponCode]
  );

  return React.useMemo(
    () => (
      <Modal
        open={isRedeemShown}
        onClose={hideRedeem}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 250 }}>
        <Grow in={isRedeemShown} timeout={250}>
          <RedeemContent>
            <RedeemHeader>
              <h4>Redeem coupon</h4>
              <IconButton color="inherit" onClick={hideRedeem}>
                <IconClose />
              </IconButton>
            </RedeemHeader>
            <RedeemBody>
              <Form>
                <TextField
                    color="primary"
                    placeholder="Enter your coupon code"
                    onChange={handleCouponCodeChange}
                    value={couponCode}>
                </TextField>
              </Form>
            </RedeemBody>
            <RedeemFooter>
              <RedeemActions>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={isRedeeming}
                    onClick={handleSubmit}>
                  {isRedeeming ? <CircularProgress size={24} color="primary" /> : 'Redeem Code'}
                </Button>
              </RedeemActions>
            </RedeemFooter>
          </RedeemContent>
        </Grow>
      </Modal>
    ),
    [
      hideRedeem,
      isRedeemShown,
      redeem,
      couponCode,
      setCouponCode,
    ]
  );
});

const Modal = styled(MUIModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RedeemContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
  padding: 0 32px;
  width: 680px;
  max-height: 80vh;
  outline: none;

  @media ${device.tablet} {
    padding: 0 16px;
    max-height: none;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

const RedeemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.palette.text.primary};
  border-bottom: 1px solid
    ${({ theme }) =>
      Colorer(theme.palette.text.primary)
        .alpha(0.1)
        .string()};
  z-index: 10;
  padding: 24px 0 8px 0;
`;

const RedeemBody = styled.div`
  display: grid;
  grid-row-gap: 30px;
  flex-grow: 1;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

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

const Form = styled.form`
  max-width: 400px;
  width: 100%;
  padding: 20px;
`;

const TextField = styled(MUITextField)`
  && {
    width: 100%;
    margin-bottom: 20px;
  }
`;

export { Redeem };
