import axios from "axios";

export function getPsTokenByItem(item, loginToken) {
  let opts = {
    url:
    "https://store.xsolla.com/api/v2/project/" +
    window.xProjectId +
    "/payment/item/" +
    item.sku,
    method: "POST",
    headers: {
      Authorization: "Bearer " + loginToken
    },
    data: {
      sandbox: true
    }
  };
  return axios(opts);
}
