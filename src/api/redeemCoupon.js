import { init } from 'store-js-sdk/src/init';
import { Coupon } from "store-js-sdk/src/coupon/coupon";

class RedeemCouponApi {
  constructor(actions, projectId, loginToken) {
    this.actions = actions;
    this.projectId = projectId;
    this.loginToken = loginToken;
  }

  redeem = async (couponCode, selectedReward) => {
    init({ projectId: this.projectId, version: 'v2' });
    const coupon = new Coupon(this.loginToken);
    let response = await coupon.redeem(couponCode, selectedReward);
    response = response.response ? response.response.data : response.data;

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(response.errorMessage);
    }

    return response.items;
  };

  rewards = async (couponCode) => {
    init({ projectId: this.projectId, version: 'v2' });
    const coupon = new Coupon(this.loginToken);
    let response = await coupon.rewards(couponCode);
    response = response.response ? response.response.data : response.data;

    if (response.statusCode < 200 || response.statusCode > 299) {
      throw new Error(response.errorMessage);
    }

    let selectableItems = [];
    if (response.is_selectable) {
      response.bonus.forEach((bonus) => {
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
