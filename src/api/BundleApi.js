export default class BundleApi {
  constructor(client, projectId) {
    this.client = client;
    this.projectId = projectId;
  }

  async loadBundles() {
    const url = `/v2/project/${this.projectId}/items/bundle`;
    const {data: { items }} = await this.client.get(url);

    return items.map(({
      sku,
      name,
      description,
      image_url,
      price,
      virtual_prices: [virtual_price]
    }) => ({
      sku,
      name,
      description,
      imageUrl: image_url,
      price: price || null,
      virtual_price: virtual_price
        ? {
            sku: virtual_price.sku,
            imageUrl: virtual_price.image_url,
            amount: virtual_price.amount,
          }
        : null,
    }));
  }
}