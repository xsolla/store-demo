import {
  OPEN_REDEEM_MODAL,
  CLOSE_REDEEM_MODAL,
} from '../action/redeem-modal-action';

const defaultState = {
  isRedeemShown: false
}

export const RedeemModalReducer = (state = defaultState, action) => {
  switch (action.type) {
    case OPEN_REDEEM_MODAL:
      return {
        ...state,
        isRedeemShown: true
      }
    case CLOSE_REDEEM_MODAL:
      return {
        ...state,
        isRedeemShown: false
      }
    default:
      return state;
  }
}