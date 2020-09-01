import React from "react";
import styled from 'styled-components';
import {SelectableItem} from "../RedeemItem";
import {withRedeemForm} from "../../../../redux/container/redeem-form-container";

class CouponRedeemRewardsComponent extends React.PureComponent {
  render() {
    const {rewards} = this.props;

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

const ItemsList = styled.div`
  display: grid;
  grid-row-gap: 30px;
  flex-grow: 1;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const CouponRedeemRewards = withRedeemForm(CouponRedeemRewardsComponent);