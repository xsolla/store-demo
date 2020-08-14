import axios from 'axios';
import { v4 } from 'uuid';

import { eatCookie } from '../utils/cookie';
import { DEMO_TOKEN } from '../utils/constants';
import { CartApi } from './cart';
import { UserApi } from './user';
import { PhysicalGoodApi } from './physicalGoods';
import { VirtualGoodsApi } from './virtualGoods';
import { VirtualCurrenciesApi } from './virtualCurrencies';
import { GamesApi } from './games';
import { InventoryApi } from './inventory';
import { EntitlementApi } from './entitlement';
import { RedeemCouponApi } from "./redeemCoupon";

class Api {
  constructor({ baseURL, projectId, paymentWidget, isPhysicalGoodDemo = false }) {
    const token = eatCookie() || DEMO_TOKEN;
    const headers = {};
    if (isPhysicalGoodDemo) {
      headers['x-unauthorized-id'] = v4();
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const config = { baseURL, headers };
    const httpClient = axios.create(config);

    this.userApi = new UserApi(httpClient, projectId, token);
    this.cartApi = new CartApi(httpClient, projectId, paymentWidget);
    this.inventoryApi = new InventoryApi(httpClient, projectId, token);
    this.physicalGoodApi = new PhysicalGoodApi(httpClient, projectId);
    this.virtualGoodsApi = new VirtualGoodsApi(httpClient, projectId);
    this.virtualCurrenciesApi = new VirtualCurrenciesApi(httpClient, projectId);
    this.gamesApi = new GamesApi(httpClient, projectId);
    this.entitlementApi = new EntitlementApi(httpClient, projectId);
    this.redeemCouponApi = new RedeemCouponApi(httpClient, projectId);
  }
}

export { Api };
