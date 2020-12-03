import { Inventory } from 'store-js-sdk/src/inventory/inventory';
import { init } from 'store-js-sdk/src/init';

class InventoryApi {
  constructor(actions, projectId, loginToken) {
    this.actions = actions;
    this.projectId = projectId;
    this.loginToken = loginToken;
  }

  loadVirtualItems = async () => {
    const url = `/v2/project/${this.projectId}/items/virtual_items`;
    const response = await this.actions.get(url);

    return convertVirtualItems(response.data.items);
  };

  loadVirtualCurrencies = async () => {
    const url = `/v2/project/${this.projectId}/items/virtual_currency`;
    const response = await this.actions.get(url);

    return convertVirtualCurrencies(response.data.items);
  };

  rewardItems = async data => {
    const url = 'https://livedemo.xsolla.com/store-demo-api/index.php';
    const response = await this.actions.post(url, data);

    return convertRewardData(response.data);
  };

  loadInventory = async () => {
    const URL = `/v2/project/${this.projectId}/user/inventory/items`;
    const response = await this.actions.get(URL);

    return convertInventoryItems(response.data.items);
  };

  consumeItem = async (sku, itemId) => {
    init({ projectId: this.projectId, version: 'v2' });
    const inventory = new Inventory(this.loginToken);
    return await inventory.consumeItem(sku, 1, itemId);
  };
}

const convertRewardData = data => ({
  userId: data.operations[0].user_id,
  itemId: data.operations[0].items[0].sku,
  quantity: data.operations[0].items[0].quantity,
});

const convertVirtualItems = items =>
  items.map(x => ({
    sku: x.sku,
    name: x.name,
    type: x.type,
    description: x.description,
    imageUrl: x.image_url,
    isFree: x.is_free,
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
            sku: x.virtual_prices[0].sku,
            imageUrl: x.virtual_prices[0].image_url,
            amount: x.virtual_prices[0].amount,
          }
        : null,
    isConsumable: Boolean(x.inventory_options.consumable),
    attributes: x.attributes
  }));

const convertVirtualCurrencies = items =>
  items.map(x => ({
    sku: x.sku,
    name: x.name,
    type: x.type,
    description: x.description,
    imageUrl: x.image_url,
    price: x.price
      ? {
          amount: x.price.amount,
          currency: x.price.currency,
        }
      : null,
  }));

const convertInventoryItems = items =>
  items
    .filter(x => x.type === 'virtual_good')
    .map(x => ({
      sku: x.sku,
      instanceId: x.instance_id,
      name: x.name,
      type: x.type,
      description: x.description,
      imageUrl: x.image_url,
      quantity: x.quantity,
      remainingUses: x.remaining_uses,
      attributes: x.attributes
    }));

export { InventoryApi };
