import axios from 'axios';

import cookie from '../utils/cookie';
import { CartApi } from './cart';
import { UserApi } from './user';
import { PhysicalGoodApi } from './physicalGoods';
import { VirtualGoodsApi } from './virtualGoods';
import { VirtualCurrenciesApi } from './virtualCurrencies';
import { InventoryApi } from './inventory';
import { EntitlementApi } from './entitlement';

class Api {
  constructor(baseURL, projectId, isPublic, paymentWidget, loginWidget) {
    const token = cookie(projectId);
    const headers = !isPublic && token ? { Authorization: `Bearer ${token}` } : undefined;
    const config = { baseURL, headers };
    const actions = axios.create(config);

    this.userApi = new UserApi(actions, projectId, token, loginWidget);
    this.cartApi = new CartApi(actions, projectId, paymentWidget);
    this.physicalGoodApi = new PhysicalGoodApi(actions, projectId, token);
    this.virtualGoodsApi = new VirtualGoodsApi(actions, projectId, token);
    this.virtualCurrenciesApi = new VirtualCurrenciesApi(actions, projectId, token);
    this.inventoryApi = new InventoryApi(actions, projectId, token);
    this.entitlementApi = new EntitlementApi(actions, projectId, token);
  }
}

export { Api };
