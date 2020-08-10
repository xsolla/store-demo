import React from 'react';
import styled from 'styled-components';
import Colorer from 'color';
import Button from '@material-ui/core/Button';

import {redeemStatuses} from "../../cart/store";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import {device} from "../../../styles/devices";
import {useStore} from "../../../store";

const mapState = state => ({
    promoCode: state.promoCode.promoCode,
});

const mapActions = actions => ({
    setPromoCode: actions.promoCode.setPromoCode,
});

const isSuccessStatus = (redeemStatus) => redeemStatus === redeemStatuses.SUCCESS;
const isDefaultStatus = (redeemStatus) => redeemStatus === redeemStatuses.DEFAULT;
const isRedeemingStatus = (redeemStatus) => redeemStatus === redeemStatuses.REDEEMING;

const PromoCode = React.memo(({redeem, redeemStatus}) => {
    const {
        promoCode,
        setPromoCode,
    } = useStore(mapState, mapActions);
    const handlePromoCodeChange = React.useCallback(event => setPromoCode(event.target.value), []);
    const handleSubmit = React.useCallback(
        event => {
            event.preventDefault();
            redeem(promoCode);
        },
        [redeem, promoCode]
    );

    return <PromoCodeContent>
        <PromoCodeForm
            onSubmit={handleSubmit}
            hidden={isRedeemingStatus(redeemStatus) || isSuccessStatus(redeemStatus)}>
            <PromoCodeTextField
                color="primary"
                placeholder="Enter your promo code, for example: NEWGAMER2020"
                onChange={handlePromoCodeChange}
            >
            </PromoCodeTextField>
            <Button
                type="submit"
                variant="contained"
                color="secondary">
                {isSuccessStatus(redeemStatus) && "Ok"}
                {isRedeemingStatus(redeemStatus) && <CircularProgress size={24} color="primary"/>}
                {isDefaultStatus(redeemStatus) && 'Redeem'}
            </Button>
        </PromoCodeForm>
    </PromoCodeContent>
});

const PromoCodeForm = styled.form`
  max-width: auto;
  width: 100%;
  padding: 10px;
`;

const PromoCodeContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  border-top: 1px solid
    ${({theme}) =>
    Colorer(theme.palette.text.primary)
        .alpha(0.1)
        .string()};
  padding: 0;
`;

const PromoCodeTextField = styled(TextField)`
  && {
    width: 80%;
    padding-right: 10px;
    @media ${device.tablet} {
      justify-content: flex-end;
      margin-bottom: 15px;
      margin-right: 0;
    }
  }
`;

export {PromoCode};
