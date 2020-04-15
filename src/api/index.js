import axios from 'axios';
import { v4 } from 'uuid';

import { eatCookie } from '../utils/cookie';
import { DEMO_TOKEN } from '../utils/constants';
import { CartApi } from './cart';
import { UserApi } from './user';
import { PhysicalGoodApi } from './physicalGoods';
import { VirtualGoodsApi } from './virtualGoods';
import { VirtualCurrenciesApi } from './virtualCurrencies';
import { InventoryApi } from './inventory';
import { EntitlementApi } from './entitlement';

class Api {
  constructor({ baseURL, projectId, paymentWidget }) {
    const token = eatCookie() || DEMO_TOKEN;
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      headers['x-unauthorized-id'] = v4();
    }
    const config = { baseURL, headers };
    const actions = axios.create(config);

    this.userApi = new UserApi(actions, projectId, token);
    this.cartApi = new CartApi(actions, projectId, paymentWidget);
    this.inventoryApi = new InventoryApi(actions, projectId, token);
    this.physicalGoodApi = new PhysicalGoodApi(actions, projectId);
    this.virtualGoodsApi = new VirtualGoodsApi(actions, projectId);
    this.virtualCurrenciesApi = new VirtualCurrenciesApi(actions, projectId);
    this.entitlementApi = new EntitlementApi(actions, projectId);
  }
}

export { Api };
