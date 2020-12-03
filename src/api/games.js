class GamesApi {
  constructor(httpClient, projectId) {
    this.httpClient = httpClient;
    this.projectId = projectId;
  }

  loadList = async () => {
    const url = `/v2/project/${this.projectId}/items/game`;
    const response = await this.httpClient.get(url);

    return convertList(response.data.items);
  };
}

const convertList = items =>
  items.map(item => {
    return ({
      sku: item.sku,
      name: item.name,
      description: item.description,
      imageUrl: item.image_url,
      attributes: item.attributes,
      unitItems: item.unit_items.map(unitItem => ({
        sku: unitItem.sku,
        name: item.name,
        description: item.description,
        imageUrl: item.image_url,
        isFree: unitItem.is_free,
        price: unitItem.price
          ? {
            amount: Number(unitItem.price.amount),
            priceWithoutDiscount: Number(unitItem.price.amount_without_discount),
            currency: unitItem.price.currency,
          }
          : null,
        virtualPrice:
          unitItem.virtual_prices.length > 0
            ? {
              sku: unitItem.virtual_prices[0].sku,
              imageUrl: unitItem.virtual_prices[0].image_url,
              amount: unitItem.virtual_prices[0].amount,
            }
            : null,
        drmSku: unitItem.drm_sku,
        drmName: unitItem.drm_name,
        hasKeys: unitItem.has_keys,
        isPreOrder: unitItem.is_pre_order,
        attributes: unitItem.attributes
      }))
    });
  });

export {GamesApi};
