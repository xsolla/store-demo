import axios from 'axios';

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
    const headers = !isPublic && token ? { Authorization: `Bearer ${token}` } : undefined;
    const config = { baseURL, headers, withCredentials: true };
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
