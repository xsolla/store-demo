import React from 'react';

import { RedeemItem } from '../RedeemItem';
import { withRedeemForm } from '../../../../redux/container/redeem-form-container';
import { ItemsList } from '../style/redeem-style';

class CouponRedeemResultComponent extends React.PureComponent {
  render() {
    const {items} = this.props;
    return (
      <ItemsList>{items.map(item => <RedeemItem key={item.sku} item={item}/>)}</ItemsList>
    );
  }
}

export const CouponRedeemResult = withRedeemForm(CouponRedeemResultComponent);
