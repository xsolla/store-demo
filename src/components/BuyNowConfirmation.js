import React from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Colorer from 'color';
import MUIIconClose from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import MUIModal from '@material-ui/core/Modal';
import Grow from '@material-ui/core/Grow';
import Backdrop from '@material-ui/core/Backdrop';

import { ProductContext } from '../../context';
import { getFormattedCurrency } from '../utils/formatCurrency';
import { getPsTokenBuyCart } from '../../components/StoreLoader';
import { device } from '../../styles/devices';
import { CartItem } from './CartItem';

const CartComponent = ({ history }) => {
  const [buyButtonDisabled, setBuyButtonDisabled] = React.useState(false);
  const {
    cart,
    hideCart,
    logToken,
    payStationHandler,
    isCartShown,
    changeItemQuantityInCart,
  } = React.useContext(ProductContext);

  return (
    <Modal
      open={isCartShown}
      onClose={hideCart}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 250 }}
    >
      <Grow in={isCartShown} timeout={250}>
        
      </Grow>
    </Modal>
  );
}

const Modal = styled(MUIModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Cart = withRouter(CartComponent);
