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
  constructor({ baseURL, projectId, isDemo, isPublic = false, paymentWidget, loginWidget }) {
    const token = isDemo ? DEMO_TOKEN : eatCookie();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    headers['x-unathorized-id'] = v4();
    const config = { baseURL, headers };
    const actions = axios.create(config);

    this.userApi = new UserApi(actions, projectId, token, loginWidget);
    this.cartApi = new CartApi(actions, projectId, paymentWidget);
    this.inventoryApi = new InventoryApi(actions, projectId, token);
    this.physicalGoodApi = new PhysicalGoodApi(actions, projectId);
    this.virtualGoodsApi = new VirtualGoodsApi(actions, projectId);
    this.virtualCurrenciesApi = new VirtualCurrenciesApi(actions, projectId);
    this.entitlementApi = new EntitlementApi(actions, projectId);
  }
}

export { Api };
