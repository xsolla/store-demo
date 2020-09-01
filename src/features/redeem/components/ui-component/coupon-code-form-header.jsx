import React from 'react';
import IconClose from '@material-ui/icons/Close';
import styled from 'styled-components';
import Colorer from 'color';
import IconButton from '@material-ui/core/IconButton';

class CouponCodeFormHeaderComponent extends React.Component {
  render() {
    const {onClick, headerText} = this.props;

    return (
      <RedeemHeader>
        <h4>{headerText}</h4>
        <IconButton color="inherit" onClick={onClick}>
          <IconClose/>
        </IconButton>
      </RedeemHeader>
    );
  }s
}

export const CouponCodeFormHeader = CouponCodeFormHeaderComponent;

const RedeemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.palette.text.primary};
  border-bottom: 1px solid
    ${({ theme }) =>
      Colorer(theme.palette.text.primary)
        .alpha(0.1)
        .string()};
  z-index: 10;
  padding: 24px 0 8px 0;
`;