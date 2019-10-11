import axios from "axios";

const CancelToken = axios.CancelToken;
let cancel;

export default async function StoreLoader(projectId, loginToken) {
  let result;
  let all = [];
  let responseGroups = await fetch(
    "https://store.xsolla.com/api/v1/project/" + projectId + "/items/groups",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + loginToken
      }
    }
  );

  const virtualCurrency = await fetch(
      "https://store.xsolla.com/api/v2/project/" + projectId + "/items/virtual_currency/package", {
        method: "GET"
      }
  );

  const virtualCurrencyPackages = await virtualCurrency.json();

  if (responseGroups) {
    // only proceed once promise is resolved
    let resolvedGroups = await responseGroups.json();
    resolvedGroups = resolvedGroups["groups"];
    // only proceed once second promise is resolved

    let fulfilledGroups = await Promise.all(
      resolvedGroups.map((oneGroup, key) => {
        //console.log("group", oneGroup);
        return loadByGroup(projectId, oneGroup);
      })
    ).then(fulfilledGroups => {
      //console.log("fulfilledGroups = ", fulfilledGroups);
      return fulfilledGroups;
    });
    all = all.concat(fulfilledGroups);
  }

  result = {
    virtualItems: all,
    virtualCurrencyPackages: virtualCurrencyPackages.items
  };
  return result;
}

function loadByGroup(projectId, group) {
  return new Promise((resolve, reject) => {
    fetch(
      "https://store.xsolla.com/api/v2/project/" +
        projectId +
        "/items/virtual_items/group/" +
        group["external_id"]
    )
      .then(response => response.json())
      .then(json => {
        let products = json["items"];
        group["products"] = products;
        resolve(group);
      })
      .catch(function(error) {
        //console.log("Products ERROR = ", error.message);
        reject(error.message);
      });
  });
}

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
      "https://store.xsolla.com/api/v1/project/" +
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
  return axios(opts)
    .then(function(response) {
      //console.log("Item added = ", response.data);
      let resp = response.data;
    })
    .catch(function(error) {
      //console.log("L2PS ERROR = ", error.response);
    });
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
      "https://store.xsolla.com/api/v1/project/" +
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
      "https://store.xsolla.com/api/v1/project/" +
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
  let opts = {
    url:
      "https://store.xsolla.com/api/v1/project/" +
      window.xProjectId +
      "/cart/" +
      cartId,
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
      //console.log("PsToken generated = ", response.data);
      return response;
    })
    .catch(function(error) {
      //console.log("L2PS ERROR = ", error.response);
    });
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
