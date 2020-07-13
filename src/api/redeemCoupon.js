import { init } from 'store-js-sdk/src/init';

class RedeemCouponApi {
  constructor(actions, projectId) {
    this.actions = actions;
    this.projectId = projectId;
  }

  redeem = async (couponCode) => {
    init({ projectId: this.projectId, version: 'v2' });
    const url = `/v2/project/${this.projectId}/coupon/redeem`;
    const data = {
      coupon_code: couponCode
    };

    const response = await this.actions.post(url, data);

    if (response.data && response.data.items) {
      return response.data.items;
    }

    throw new Error('Oops! Something went wrong!');
  };
}

export { RedeemCouponApi };
