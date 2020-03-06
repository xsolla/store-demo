import axios from 'axios';

import { CartApi } from './cart';
import { PhysicalGoodApi } from './physicalGoods';
import { VirtualGoodsApi } from './virtualGoods';
import { VirtualCurrenciesApi } from './virtualCurrencies';
import { InventoryApi } from './inventory';
import { EntitlementApi } from './entitlement';

class Api {
  constructor(baseURL, projectId, loginToken, paymentWidget) {
    const headers = loginToken ? { Authorization: `Bearer ${loginToken}` } : undefined;
    const config = { baseURL, headers };
    const actions = axios.create(config);

    this.cartApi = new CartApi(actions, projectId, paymentWidget);
    this.physicalGoodApi = new PhysicalGoodApi(actions, projectId, loginToken);
    this.virtualGoodsApi = new VirtualGoodsApi(actions, projectId, loginToken);
    this.virtualCurrenciesApi = new VirtualCurrenciesApi(actions, projectId, loginToken);
    this.inventoryApi = new InventoryApi(actions, projectId, loginToken);
    this.entitlementApi = new EntitlementApi(actions, projectId, loginToken);
  }
}

export { Api };
