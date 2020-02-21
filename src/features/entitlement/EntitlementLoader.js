import axios from 'axios';

const CancelToken = axios.CancelToken;
let cancel;

export const getEntitlement = (projectId, loginToken) => {
  cancel && cancel();
  let opts = {
    url:
    `https://store.xsolla.com/api/v2/projects/entitlement`,
    method: "GET",
    headers: {
      Authorization: "Bearer " + loginToken
    },
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    })
  };

  return axios(opts)
    .then(function(response) {
      return response.data;
    });
};

export const redeem = async (projectId, loginToken, redeemCode, sku) => {
  cancel && cancel();
  const url = 'https://store.xsolla.com/api/v1/game_delivery/xsolla_login/redeem_key';
  const data = {
    project_id: projectId,
    digital_content_sku: sku,
    language: "en",
    key: redeemCode
  };

  const params = {
    headers: {
      Authorization: "Bearer " + loginToken
    },
    cancelToken: new CancelToken(c => {
      cancel = c;
    }),
  };

  const response = axios.post(url, data, params);

  return response.data;
};
