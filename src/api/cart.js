import axios from 'axios';
import {init} from "store-js-sdk/src/init";

class CartApi {
  constructor(actions, projectId, paymentWidget) {
    this.CancelToken = axios.CancelToken;
    this.actions = actions;
    this.projectId = projectId;
    this.paymentWidget = paymentWidget;

    this.cartGettingCancel = () => void 0;
    this.quantityChangingCancel = () => void 0;
  }

  getCart = async () => {
    const url = `/v2/project/${this.projectId}/cart`;
    const params = {
      cancelToken: new this.CancelToken(c => {
        this.cartGettingCancel();
        this.cartGettingCancel = c;
      }),
    };

    const response = await this.actions.get(url, params);

    return convertCart(response.data);
  };

  changeItemQuantity = async (sku, quantity) => {
    const url = `/v2/project/${this.projectId}/cart/item/${sku}`;
    const data = JSON.stringify({ quantity });
    const params = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      cancelToken: new this.CancelToken(c => {
        this.cartGettingCancel();
        this.quantityChangingCancel();
        this.quantityChangingCancel = c;
      }),
    };

    await this.actions.put(url, data, params);
  };

  removeItemFromCart = async sku => {
    const url = `/v2/project/${this.projectId}/cart/item/${sku}`;
    const params = {
      cancelToken: new this.CancelToken(() => {
        this.cartGettingCancel();
        this.quantityChangingCancel();
      }),
    };

    await this.actions.delete(url, params);
  };

  clearCart = async () => {
    const url = `/v2/project/${this.projectId}/cart/clear`;
    await this.actions.put(url);
  };

  payForGoods = async () => {
    const url = `/v2/project/${this.projectId}/payment/cart`;
    const data = {
      sandbox: true,
      settings: {
        ui: {
          theme: 'dark',
        },
      },
    };

    const response = await this.actions.post(url, data);

    return new Promise((resolve, reject) => {
      this.paymentWidget.init({
        host: 'sandbox-secure.xsolla.com',
        sandbox: true,
        access_token: response.data.token,
        lightbox: {
          height: 675,
          spinner: 'round',
          width: '740px',
          spinnerColor: '#fff',
          contentBackground: 'rgba(0,0,0,0.5)',
        },
      });

      this.paymentWidget.open();
      this.paymentWidget.on(this.paymentWidget.eventTypes.CLOSE, () => reject({ cancelled: true }));
      this.paymentWidget.on(this.paymentWidget.eventTypes.STATUS_DONE, () => resolve());
    });
  };

  quickPurchaseByVirtualCurrency = async (sku, vcSKU) => {
    const url = `/v2/project/${this.projectId}/payment/item/${sku}/virtual/${vcSKU}`;
    const response = await this.actions.post(url);

    return response.data;
  };

  purchaseItems = async data => {
    const url = `https://livedemo.xsolla.com/store-demo-api/index.php`;
    const response = await axios.post(url, data);

    return response.data;
  };

  redeem = async (promoCode) => {
    init({ projectId: this.projectId, version: 'v2' });
    const url = `/v2/project/${this.projectId}/promocode/redeem`;
    const data = {
      coupon_code: promoCode,
      cart: null
    };

    const response = await this.actions.post(url, data);

    if (response.data) {
      return convertCart(response.data);
    }

    throw new Error('Oops! Something went wrong!');
  };
}

const convertItems = items =>
  items.map(x => ({
    sku: x.sku,
    name: x.name,
    type: x.type,
    description: x.description,
    imageUrl: x.image_url,
    price: x.price
      ? {
          amount: Number(x.price.amount),
          priceWithoutDiscount: Number(x.price.amount_without_discount),
          currency: x.price.currency,
        }
      : null,
    virtualPrice:
      x.virtual_prices.length > 0
        ? {
            imageUrl: x.virtual_prices[0].image_url,
            amount: Number(x.virtual_prices[0].amount),
          }
        : null,
    quantity: x.quantity,
  }));

const convertCart = cart => ({
  id: cart.cart_id,
  price: cart.price
    ? {
        price: cart.price.amount,
        priceWithoutDiscount: cart.price.amount_without_discount,
        currency: cart.price.currency,
      }
    : null,
  items: convertItems(cart.items),
});

export { CartApi };
