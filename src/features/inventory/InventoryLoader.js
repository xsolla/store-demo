import axios from 'axios';
import { Inventory } from 'store-js-sdk/src/inventory/inventory';
import { init } from 'store-js-sdk/src/init';

export const loadInventory = async (projectId, loginToken) => {
  const URL = `https://store.xsolla.com/api/v2/project/${projectId}/user/inventory/items`;
  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`
    },
  };
  const response = await axios.get(URL, params);

  return response.data.items.filter(x => x.type === 'virtual_good');
}

export const consumeItem = async (projectId, loginToken, item) => {
  init({ projectId, version: 'v2' });
  const inventory = new Inventory(loginToken);
  return await inventory.consumeItem(item.sku, 1, item.instance_id);
}