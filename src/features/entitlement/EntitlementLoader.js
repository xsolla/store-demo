import axios from 'axios';
import { init } from 'store-js-sdk/src/init';

export const getEntitlement = async loginToken => {
  const url = 'https://store.xsolla.com/api/v2/projects/entitlement';
  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`
    },
  };
  const response = await axios.get(url, params);

  return response.data;
};

export const redeem = async (projectId, loginToken, redeemCode, sku) => {
  init({ projectId, version: 'v2' });
  const url = 'https://store.xsolla.com/api/v1/game_delivery/xsolla_login/redeem_key';
  const data = {
    project_id: projectId,
    digital_content_sku: sku,
    language: "en",
    key: redeemCode
  };

  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`
    },
  };

  const response = await axios.post(url, data, params);

  return response.data;
};
