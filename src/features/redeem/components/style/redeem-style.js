import styled from 'styled-components';
import MUIModal from '@material-ui/core/Modal';

import { device } from '../../../../styles/devices';
import Colorer from 'color';
import MUITextField from "@material-ui/core/TextField";

const Modal = styled(MUIModal)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RedeemContent = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${({theme}) => `${theme.shape.borderRadius}px`};
  background-color: ${({theme}) => theme.palette.background.default};
  color: ${({theme}) => theme.palette.text.primary};
  padding: 0 32px;
  width: 680px;
  max-height: 80vh;
  outline: none;

  @media ${device.tablet} {
    padding: 0 16px;
    max-height: none;
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

const Form = styled.form`
  max-width: auto;
  width: 100%;
  padding: 20px;
`;

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

const ItemsList = styled.div`
  display: grid;
  grid-row-gap: 30px;
  flex-grow: 1;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

const RedeemBody = styled.div`
  display: grid;
  grid-row-gap: 30px;
  flex-grow: 1;
  padding: 16px 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

const RedeemFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  border-top: 1px solid
    ${({ theme }) =>
  Colorer(theme.palette.text.primary)
    .alpha(0.1)
    .string()};
  padding: 24px 0 24px 0;
`;

const RedeemActions = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 7px;
`;

const TextField = styled(MUITextField)`
  && {
    width: 100%;
    margin-bottom: 20px;
  }
`;

export {
  Modal,
  RedeemContent,
  Form,
  RedeemHeader,
  ItemsList,
  RedeemBody,
  RedeemFooter,
  RedeemActions,
  TextField
};