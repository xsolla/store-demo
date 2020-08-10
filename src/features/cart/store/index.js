import React from 'react';

import { generateUUID } from '../../../utils/generateUUID';

export const redeemStatuses = {
  SUCCESS: 'success',
  DEFAULT: 'default',
  REDEEMING: 'redeeming'
};

const initialState = {
  id: null,
  items: [],
  price: {
    amount: 0,
    amountWithoutDiscount: 0,
    currency: '',
  },

  isShown: false,
  isLoading: false,
  isPurchasing: false,
  isClearing: false,
  isQuantityChanging: false,
  isItemAdding: false,
  isItemRemoving: false,
  isPaying: false,

  redeemStatus: redeemStatuses.DEFAULT,
};

const SHOW_CART = 'CART_SHOW';
const HIDE_CART = 'CART_HIDE';

const GET_CART = 'GET_CART';
const GET_CART_SUCCESS = 'GET_CART_SUCCESS';
const GET_CART_FAIL = 'GET_CART_FAIL';

const ADD_TO_CART = 'ADD_TO_CART';
const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
const ADD_TO_CART_FAIL = 'ADD_TO_CART_FAIL';

const CHANGE_QUANTITY = 'CHANGE_QUANTITY';
const CHANGE_QUANTITY_SUCCESS = 'CHANGE_QUANTITY_SUCCESS';
const CHANGE_QUANTITY_FAIL = 'CHANGE_QUANTITY_FAIL';

const REMOVE_ITEM = 'REMOVE_ITEM';
const REMOVE_ITEM_SUCCESS = 'REMOVE_ITEM_SUCCESS';
const REMOVE_ITEM_FAIL = 'REMOVE_ITEM_FAIL';

const CLEAR_CART = 'CLEAR_CART';
const CLEAR_CART_SUCCESS = 'CLEAR_CART_SUCCESS';
const CLEAR_CART_FAIL = 'CLEAR_CART_FAIL';

const PAY_FOR_GOODS = 'PAY_FOR_GOODS';
const PAY_FOR_GOODS_SUCCESS = 'PAY_FOR_GOODS_SUCCESS';
const PAY_FOR_GOODS_FAIL = 'PAY_FOR_GOODS_FAIL';

const PURCHASE = 'PURCHASE';
const PURCHASE_SUCCESS = 'PURCHASE_SUCCESS';
const PURCHASE_FAIL = 'PURCHASE_FAIL';

const PROMO_CODE_REDEEM = 'PROMO_CODE_REDEEM';
const PROMO_CODE_REDEEM_SUCCESS = 'PROMO_CODE_REDEEM_SUCCESS';
const PROMO_CODE_REDEEM_FAIL = 'PROMO_CODE_REDEEM_FAIL';

const compareItems = (a, b) => (a.sku > b.sku ? 1 : -1);

const reducer = (state, action) => {
  switch (action.type) {
    case SHOW_CART:
      return {
        ...state,
        isShown: true,
      };
    case HIDE_CART:
      return {
        ...state,
        isShown: false,
      };

    case GET_CART:
      return {
        ...state,
        isLoading: true,
      };
    case GET_CART_SUCCESS:
      return {
        ...state,
        id: action.payload.id,
        items: action.payload.items.sort(compareItems),
        price: action.payload.price || initialState.price,
        isLoading: false,
      };
    case GET_CART_FAIL:
      return {
        ...state,
        isLoading: false,
      };

    case ADD_TO_CART:
      return {
        ...state,
        isItemAdding: true,
      };
    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        items: [{ ...action.payload, quantity: 1 }, ...state.items].sort(compareItems),
        price: {
          ...state.price,
          amount: state.price.amount + action.payload.price.amount,
          amountWithoutDiscount:
            state.price.amountWithoutDiscount + action.payload.price.amountWithoutDiscount,
        },
        isItemAdding: false,
      };
    case ADD_TO_CART_FAIL:
      return {
        ...state,
        isItemAdding: false,
      };

    case CHANGE_QUANTITY: {
      const updatedItemIndex = state.items.findIndex(item => item.sku === action.payload.item.sku);
      const updatedItem = state.items[updatedItemIndex];

      if (updatedItem) {
        return {
          ...state,
          items: [
            ...state.items.slice(0, updatedItemIndex),
            { ...updatedItem, quantity: action.payload.quantity },
            ...state.items.slice(updatedItemIndex + 1),
          ].sort(compareItems),
          isQuantityChanging: true,
        };
      } else {
        return state;
      }
    }
    case CHANGE_QUANTITY_SUCCESS:
      return {
        ...state,
        isQuantityChanging: false,
      };
    case CHANGE_QUANTITY_FAIL:
      return {
        ...state,
        isQuantityChanging: false,
      };

    case REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.sku !== action.payload.sku).sort(compareItems),
        isItemRemoving: true,
      };
    }
    case REMOVE_ITEM_SUCCESS:
      return {
        ...state,
        isItemRemoving: false,
      };
    case REMOVE_ITEM_FAIL:
      return {
        ...state,
        isItemRemoving: false,
      };

    case CLEAR_CART: {
      return {
        ...state,
        isClearing: true,
      };
    }
    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        id: initialState.id,
        items: initialState.items,
        price: initialState.price,
        isClearing: false,
      };
    case CLEAR_CART_FAIL:
      return {
        ...state,
        isClearing: false,
      };

    case PAY_FOR_GOODS: {
      return {
        ...state,
        isPaying: true,
      };
    }
    case PAY_FOR_GOODS_SUCCESS:
      return {
        ...state,
        isPaying: false,
      };
    case PAY_FOR_GOODS_FAIL:
      return {
        ...state,
        isPaying: false,
      };

    case PURCHASE: {
      return {
        ...state,
        isPurchasing: true,
      };
    }
    case PURCHASE_SUCCESS:
      return {
        ...state,
        isPurchasing: false,
      };
    case PURCHASE_FAIL:
      return {
        ...state,
        isPurchasing: false,
      };
    case PROMO_CODE_REDEEM:
      return {
        ...state,
        redeemStatus: redeemStatuses.REDEEMING,
      };
    case PROMO_CODE_REDEEM_SUCCESS:
      return {
        ...state,
        redeemStatus: redeemStatuses.SUCCESS,
        id: action.payload.id,
        items: action.payload.items.sort(compareItems),
        price: action.payload.price || initialState.price,
      };
    case PROMO_CODE_REDEEM_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export const useCart = (api, notify, callAfterPayment) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const show = React.useCallback(() => dispatch({ type: SHOW_CART }), []);
  const hide = React.useCallback(() => dispatch({ type: HIDE_CART }), []);

  const getCart = React.useCallback(async () => {
    try {
      dispatch({ type: GET_CART });
      const cart = await api.cartApi.getCart();
      dispatch({ type: GET_CART_SUCCESS, payload: cart });
    } catch (error) {
      if (!error.__CANCEL__) {
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        notify(errorMsg, { variant: 'error' });
      }
      dispatch({ type: GET_CART_FAIL });
    }
  }, [api.cartApi, notify]);

  const addItem = React.useCallback(
    async item => {
      const items = state.items;
      const isItemExist = items.some(elem => elem.sku === item.sku);
      if (!isItemExist) {
        try {
          dispatch({ type: ADD_TO_CART });
          await api.cartApi.changeItemQuantity(item.sku, 1);
          dispatch({ type: ADD_TO_CART_SUCCESS, payload: item });
          getCart();
          show();
        } catch (error) {
          if (!error.__CANCEL__) {
            getCart();
            const errorMsg = error.response ? error.response.data.errorMessage : error.message;
            notify(errorMsg, { variant: 'error' });
          }
          dispatch({ type: ADD_TO_CART_FAIL });
        }
      } else {
        show();
      }
    },
    [api.cartApi, getCart, notify, show, state.items]
  );

  const changeItemQuantity = React.useCallback(
    async (item, quantity) => {
      try {
        dispatch({ type: CHANGE_QUANTITY, payload: { item, quantity } });
        await api.cartApi.changeItemQuantity(item.sku, quantity);
        getCart();
        dispatch({ type: CHANGE_QUANTITY_SUCCESS });
      } catch (error) {
        if (!error.__CANCEL__) {
          getCart();
          const errorMsg = error.response ? error.response.data.errorMessage : error.message;
          notify(errorMsg, { variant: 'error' });
        }
        dispatch({ type: CHANGE_QUANTITY_FAIL });
      }
    },
    [api.cartApi, getCart, notify]
  );

  const removeItem = React.useCallback(
    async item => {
      try {
        dispatch({ type: REMOVE_ITEM, payload: item });
        await api.cartApi.removeItemFromCart(item.sku);
        getCart();
        dispatch({ type: REMOVE_ITEM_SUCCESS });
      } catch (error) {
        if (!error.__CANCEL__) {
          getCart();
          const errorMsg = error.response ? error.response.data.errorMessage : error.message;
          notify(errorMsg, { variant: 'error' });
        }
        dispatch({ type: REMOVE_ITEM_FAIL });
      }
    },
    [api.cartApi, getCart, notify]
  );

  const clearCart = React.useCallback(async () => {
    try {
      dispatch({ type: CLEAR_CART });
      await api.cartApi.clearCart();
      dispatch({ type: CLEAR_CART_SUCCESS });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: CLEAR_CART_FAIL });
    }
  }, [api.cartApi, notify]);

  const payForGoods = React.useCallback(async () => {
    try {
      dispatch({ type: PAY_FOR_GOODS });
      hide();
      await api.cartApi.payForGoods();
      clearCart();
      callAfterPayment();
      dispatch({ type: PAY_FOR_GOODS_SUCCESS });
    } catch (error) {
      if (error.cancelled) {
        notify('Payment cancelled', { variant: 'warning' });
      } else {
        const errorMsg = error.response ? error.response.data.errorMessage : error.message;
        notify(errorMsg, { variant: 'error' });
      }
      dispatch({ type: PAY_FOR_GOODS_FAIL });
    }
  }, [api.cartApi, callAfterPayment, clearCart, hide, notify]);

  const purchase = React.useCallback(async () => {
    try {
      const price = state.price;
      const items = state.items;
      const data = {
        type: 'purchase',
        user: 'd342dad2-9d59-11e9-a384-42010aa8003f',
        platform: 'playstation_network',
        purchase: {
          amount: price.amount,
          currency: price.currency,
          external_purchase_id: generateUUID(),
          external_purchase_date: new Date().toISOString(),
        },
        items: items.map(({ sku, quantity }) => ({ sku, quantity })),
      };
      dispatch({ type: PURCHASE });
      await api.cartApi.purchaseItems(data);
      clearCart();
      callAfterPayment();
      notify(`Items are purchased`, { variant: 'success' });
      dispatch({ type: PURCHASE_SUCCESS });
    } catch (error) {
      const errorMsg = error.response ? error.response.data.errorMessage : error.message;
      notify(errorMsg, { variant: 'error' });
      dispatch({ type: PURCHASE_FAIL });
    }
  }, [api.cartApi, clearCart, notify, state.items, state.price]);

  const redeem = React.useCallback(
      async (couponCode) => {
        dispatch({ type: PROMO_CODE_REDEEM });
        try {
          const cart = await api.cartApi.redeem(couponCode);
          dispatch({ type: PROMO_CODE_REDEEM_SUCCESS, payload: cart });
        } catch (error) {
          const errorMsg = error.response ? error.response.data.errorMessage : error.message;
          notify(errorMsg, { variant: 'error' });
          dispatch({ type: PROMO_CODE_REDEEM_FAIL });
        }
      },
      [api.redeemPromoCodeApi, notify]
  );

  return React.useMemo(
      () => [
        state,
        {
          show,
          hide,
          getCart,
          addItem,
          changeItemQuantity,
          removeItem,
          clearCart,
          payForGoods,
          purchase,
          redeem,
        },
      ],
      [
        addItem,
        changeItemQuantity,
        clearCart,
        getCart,
        hide,
        payForGoods,
        purchase,
        removeItem,
        show,
        state,
        redeem,
      ]
  );
};
