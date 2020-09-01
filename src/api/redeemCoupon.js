import { init } from 'store-js-sdk/src/init';

class RedeemCouponApi {
  constructor(actions, projectId) {
    this.actions = actions;
    this.projectId = projectId;
  }

  redeem = async (couponCode, selectedReward) => {
    init({ projectId: this.projectId, version: 'v2' });
    const url = `/v2/project/${this.projectId}/coupon/redeem`;
    const data = {
      coupon_code: couponCode
    };

    if (selectedReward !== null) {
      data['selected_unit_items'] = selectedReward
    }

    const response = await this.actions.post(url, data);

    if (response.data && response.data.items) {
      return response.data.items;
    }

    throw new Error('Oops! Something went wrong!');
  };

  rewards = async (couponCode) => {
    init({ projectId: this.projectId, version: 'v2' });
    const url = `/v2/project/${this.projectId}/coupon/code/${couponCode}/rewards`;

    const response = await this.actions.get(url);

    if (!response.data && response.data.is_selectable === undefined) {
      throw new Error('Oops! Something went wrong!');
    }

    let selectableItems = [];
    if (response.data && response.data.is_selectable) {
      response.data.bonus.forEach((bonus) => {
        const item = bonus.item;
        if (item.type === 'unit') {
          selectableItems.push(bonus);
        }
      });
    }

    return selectableItems;
  };
}

export { RedeemCouponApi };
