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
  return axios(opts)
    .then(function(response) {
      //console.log('createCart ', response.data["id"]);
      return response;
    })
    .catch(function(error) {
      //console.log("L2PS ERROR = ", error.response);
    });
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
  return axios(opts)
    .then(function(response) {
      //console.log("Item removed = ", response.data);
      let resp = response.data;
    })
    .catch(function(error) {
      //console.log("L2PS ERROR = ", error.response);
    });
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

export function quickPurchaseBuyVirtualCurrency(product, vcPriceSku, loginToken) {
  let opts = {
    url:
        "https://store.xsolla.com/api/v2/project/" +
        window.xProjectId +
        "/payment/item/" +
        product.sku +
        "/virtual/" + vcPriceSku,
    method: "POST",
    headers: {
      Authorization: "Bearer " + loginToken
    }
  };
  return axios(opts);
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
