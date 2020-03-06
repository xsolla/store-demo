class VirtualGoodsApi {
  constructor(actions, projectId, loginToken) {
    this.actions = actions;
    this.projectId = projectId;
    this.loginToken = loginToken;
  }

  loadVirtualItems = async () => {
    const url = `/v2/project/${this.projectId}/items/groups`
    const response = await this.actions.get(url);
  
    const [...groups] = await Promise.all(response.data.groups.map(async g => {
      const items = await this.loadVirtualItemsByGroup(g.external_id);
      return {
        groupId: g.external_id,
        groupName: g.name,
        items: convertVirtualGoods(items),
      };
    }));
  
    return groups;
  };

  loadVirtualItemsByGroup = async groupId => {
    const url = `/v2/project/${this.projectId}/items/virtual_items/group/${groupId}`
    const response = await this.actions.get(url);
  
    return response.data.items;
  }
}

const convertVirtualGoods = items => items.map(x => ({
  sku: x.sku,
  name: x.name,
  type: x.type,
  description: x.description,
  imageUrl: x.image_url,
  isFree: x.is_free,
  price: x.price ? {
    amount: Number(x.price.amount),
    priceWithoutDiscount: Number(x.price.amount_without_discount),
    currency: x.price.currency
  } : null,
  virtualPrice: x.virtual_prices.length > 0 ? {
    sku: x.virtual_prices[0].sku,
    imageUrl: x.virtual_prices[0].image_url,
    amount: x.virtual_prices[0].amount,
  } : null,
  isConsumable: Boolean(x.inventory_options.consumable),
}));

export { VirtualGoodsApi };
