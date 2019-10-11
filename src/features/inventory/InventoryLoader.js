import axios from "axios";

const CancelToken = axios.CancelToken;
let cancel;

export const getInventory = (projectId, loginToken) => {
  cancel && cancel();
  let opts = {
    url:
    `https://store.xsolla.com/api/v2/project/${projectId}/user/inventory/items`,
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
      return response.data.items;
    });
}