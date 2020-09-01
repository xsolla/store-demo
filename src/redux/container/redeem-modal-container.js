import {connect} from 'react-redux';

import {
  OpenRedeemModal,
  CloseRedeemModal
} from '../action/redeem-modal-action';


const mapStateToProps = (state) => (
  {
    isRedeemShown: state.redeem_modal.isRedeemShown
  }
);

export const mapDispatchToProps = (dispatch) => {
  return {
    openRedeemModal: () => {
      dispatch(OpenRedeemModal())
    },
    closeRedeemModal: () => {
      dispatch(CloseRedeemModal())
    }
  }
}

export const withRedeemModalWindow = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {forwardRef: true}
);
