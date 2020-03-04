import React from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import Colorer from 'color';
import IconButton from '@material-ui/core/IconButton';
import IconClose from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import MUIModal from '@material-ui/core/Modal';
import Grow from '@material-ui/core/Grow';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ProductContext } from '../../context';
import { quickPurchaseBuyVirtualCurrency } from '../../components/StoreLoader';
import { device } from '../../styles/devices';
import { VCCartItem } from './VCCartItem';

const VCCart = () => {
  const {
    vcCart,
    isVCCartShown,
    projectId,
    logToken,
    clearVCCart,
    setStateFrom,
    hideVCCart,
    isVCCartProcessing,
    updateVirtualCurrencyBalance,
  } = React.useContext(ProductContext);
  const { enqueueSnackbar } = useSnackbar();

  const buyByVirtualCurrencyButtonAction = () => {
    setStateFrom('isVCCartProcessing', true);
    quickPurchaseBuyVirtualCurrency(projectId, vcCart.items[0], logToken)
      .then(() => {
        setStateFrom('isVCCartProcessing', false);
        clearVCCart();
        updateVirtualCurrencyBalance();
      })
      .catch(error => {
        setStateFrom('isVCCartProcessing', false);
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        enqueueSnackbar(errorMsg, { variant: 'error' });
      });
  };

  return (
    <Modal
      open={isVCCartShown}
      onClose={hideVCCart}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 250 }}
    >
      <Grow in={isVCCartShown} timeout={250}>
        <CartContent>
          <CartHeader>
            <h4>Confirm</h4>
            <IconButton color="inherit" onClick={hideVCCart}>
              <IconClose />
            </IconButton>
          </CartHeader>
          <CartList>
            {vcCart.items.length > 0
              ? vcCart.items.map(item => <VCCartItem item={item}/>)
              : <p>Empty cart</p>
            }
          </CartList>
          <CartFooter>
            <Button
              variant="contained"
              disabled={isVCCartProcessing}
              onClick={buyByVirtualCurrencyButtonAction}
            >
              {isVCCartProcessing ? <CircularProgress size={24} /> : 'Buy'}
            </Button>
          </CartFooter>
        </CartContent>
      </Grow>
    </Modal>
  );
}

const Modal = styled(MUIModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CartContent = styled.div`
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

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => Colorer(theme.palette.text.primary).alpha(0.1).string()};
  z-index: 10;
  padding: 24px 0 8px 0;
`;

const CartList = styled.div`
  display: grid;
  grid-row-gap: 30px;
  flex-grow: 1;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

const CartFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => Colorer(theme.palette.text.primary).alpha(0.1).string()};
  padding: 24px 0 24px 0;
`;

export { VCCart };
