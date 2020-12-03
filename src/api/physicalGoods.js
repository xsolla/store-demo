import { PhysicalGood } from 'store-js-sdk/src/physical-goods/physical-goods';
import { init } from 'store-js-sdk/src/init';

class PhysicalGoodApi {
  constructor(actions, projectId) {
    this.actions = actions;
    this.projectId = projectId;
  }

  loadPhysicalGoods = async () => {
    init({ projectId: this.projectId, version: 'v2' });
    const physicalGood = new PhysicalGood();
    const response = await physicalGood.getPhysicalGoodList();
    return convertPhysicalGoods(response.data.items);
  };
}

const convertPhysicalGoods = items =>
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
    attributes: x.attributes
  }));

export { PhysicalGoodApi };
