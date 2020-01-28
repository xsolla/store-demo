import axios from "axios";

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

export const redeem = (projectId, loginToken, redeemCode, sku) => {
  cancel && cancel();

  let opts = {
    url:
        `https://store.xsolla.com/api/v1/game_delivery/xsolla_login/redeem_key`,
    method: "POST",
    headers: {
      Authorization: "Bearer " + loginToken
    },
    data: {
      project_id: projectId,
      digital_content_sku: sku,
      language: "en",
      key: redeemCode
    },
    cancelToken: new CancelToken(function executor(c) {
      cancel = c;
    }),
  };

  return axios(opts);
};
