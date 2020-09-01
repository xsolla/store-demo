import React from "react";
import styled from 'styled-components';
import {RedeemItem} from "../RedeemItem";
import {withRedeemForm} from "../../../../redux/container/redeem-form-container";

class CouponRedeemResultComponent extends React.PureComponent {
  render() {
    const {items} = this.props;
    return (
      <ItemsList>{items.map(item => <RedeemItem key={item.sku} item={item}/>)}</ItemsList>
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

export const CouponRedeemResult = withRedeemForm(CouponRedeemResultComponent);