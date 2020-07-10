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

    await this.actions.put(url, data);
  };
}

export { RedeemCouponApi };
