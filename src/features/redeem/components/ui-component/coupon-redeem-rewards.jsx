import React from 'react';

import { SelectableItem } from '../RedeemItem';
import { withRedeemForm } from '../../../../redux/container/redeem-form-container';
import { ItemsList } from '../style/redeem-style';

class CouponRedeemRewardsComponent extends React.PureComponent {
  render() {
    const {rewards} = this.props;

    let initialRewards = {};
    rewards.forEach((reward) => {
      const unitItem = reward.item;
      initialRewards[unitItem.sku] = unitItem.unit_items[0].sku;
    });

    const selectableItems = [];
    rewards.forEach((reward) => {
      const unitItem = reward.item;
      selectableItems.push(
        <ItemsList key={unitItem.sku}>
          {
            <SelectableItem
              key={unitItem.sku + reward.quantity}
              unitItem={unitItem}
              quantity={reward.quantity}
              initialRewards={initialRewards}
            />
          }
        </ItemsList>
      )
    })

    return (
      selectableItems
    );
  }
}

export const CouponRedeemRewards = withRedeemForm(CouponRedeemRewardsComponent);