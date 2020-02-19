import axios from "axios";

const CancelToken = axios.CancelToken;
let cancel;

export function changeItemQuantityCart(
  { sku = "sku" },
  quantity,
  cartId,
  loginToken
) {
  cancel && cancel();
  //console.log("sku added = ", sku, " to cartId = ", cartId);
  let opts = {
    url:
      "https://store.xsolla.com/api/v2/project/" +
      window.xProjectId +
      "/cart/" +
      cartId +
      "/item/" +
      sku,
    method: "PUT",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: "Bearer " + loginToken
    },
    data: JSON.stringify({
      quantity: quantity
    })
  };
  return axios(opts);
}

export function createCart(loginToken) {
  let opts = {
    url:
      "https://store.xsolla.com/api/v1/project/" + window.xProjectId + "/cart",
    method: "POST",
    headers: {
      Authorization: "Bearer " + loginToken
    }
  };
  return axios(opts);
}

export function removeItemFromCart({ sku = "sku" }, cartId, loginToken) {
  cancel && cancel();
  //console.log("sku removed = ", sku, " from cartId = ", cartId);
  let opts = {
    url:
      "https://store.xsolla.com/api/v2/project/" +
      window.xProjectId +
      "/cart/" +
      cartId +
      "/item/" +
      sku,
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + loginToken
    }
  };
  return axios(opts);
}

export function getPsTokenBuyCart(cartId, loginToken) {
  let opts = {
    url:
      "https://store.xsolla.com/api/v2/project/" +
      window.xProjectId +
      "/payment/cart/" +
      cartId,
    method: "POST",
    headers: {
      Authorization: "Bearer " + loginToken
    },
    data: {
      sandbox: true
    }
  };
  return axios(opts)
    .then(function(response) {
      //console.log("PsToken generated = ", response.data);
      return response;
    })
    .catch(function(error) {
      //console.log("L2PS ERROR = ", error.response);
    });
}

export function getCart(cartId, loginToken) {
  cancel && cancel();
  const opts = {
    url:
      "https://store.xsolla.com/api/v2/project/" +
      window.xProjectId +
      "/cart/" +
      cartId,
    method: "GET",
    headers: {
      Authorization: "Bearer " + loginToken
    },
    cancelToken: new CancelToken(c => {
      cancel = c;
    })
  };
  return axios(opts)
    .then(response => response)
    .catch(error => console.error(error));
}

export const quickPurchaseBuyVirtualCurrency = async (projectId, product, loginToken) => {
  const url = `https://store.xsolla.com/api/v2/project/${projectId}/payment/item/${product.sku}/virtual/${product.virtual_prices[0].sku}`;
  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`
    }
  };

  const response = await axios.post(url, {}, params);

  return response.data;
}

export function getVirtualCurrencyBalance(loginToken) {
  let opts = {
    url:
        "https://store.xsolla.com/api/v2/project/" + window.xProjectId + "/user/virtual_currency_balance",
    method: "GET",
    headers: {
      Authorization: "Bearer " + loginToken
    }
  };
  return axios(opts);
}
