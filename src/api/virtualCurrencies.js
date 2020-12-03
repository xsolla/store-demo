class VirtualCurrenciesApi {
  constructor(actions, projectId) {
    this.actions = actions;
    this.projectId = projectId;
  }

  loadVirtualCurrencies = async () => {
    const url = `https://store.xsolla.com/api/v2/project/${this.projectId}/items/virtual_currency/package`;
    const response = await this.actions.get(url);

    return convertVirtualCurrencies(response.data.items);
  };
}

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
    attributes: x.attributes
  }));

export { VirtualCurrenciesApi };
