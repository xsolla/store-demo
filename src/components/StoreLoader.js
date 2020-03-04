import axios from 'axios';

const CancelToken = axios.CancelToken;

let cartGettingCancel = () => void 0
export const getCart = async (projectId, loginToken, cartId) => {
  const url = `https://store.xsolla.com/api/v2/project/${projectId}/cart/${cartId}`
  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    },
    cancelToken: new CancelToken(c => {
      cartGettingCancel();
      cartGettingCancel = c;
    })
  };

  const response = await axios.get(url, params);

  return response.data;
}

let quantityChangingCancel = () => void 0;
export const changeItemQuantityCart = async (
  projectId,
  loginToken,
  cartId,
  sku,
  quantity,
) => {
  const url = `https://store.xsolla.com/api/v2/project/${projectId}/cart/${cartId}/item/${sku}`;
  const data = JSON.stringify({ quantity });
  const params = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${loginToken}`
    },
    cancelToken: new CancelToken(c => {
      cartGettingCancel();
      quantityChangingCancel();
      quantityChangingCancel = c;
    })
  }

  const response = await axios.put(url, data, params);
 
  return response.data;
}

export const createCart = async (projectId, loginToken) => {
  const url = `https://store.xsolla.com/api/v1/project/${projectId}/cart`;
  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    }
  }

  const response = await axios.post(url, undefined, params);

  return response.data;
}

export const removeItemFromCart = async (projectId, loginToken, cartId, sku) => {
  const url = `https://store.xsolla.com/api/v2/project/${projectId}/cart/${cartId}/item/${sku}`;
  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`
    },
    cancelToken: new CancelToken(c => {
      cartGettingCancel();
      quantityChangingCancel();
    })
  }
  
  const response = await axios.delete(url, params);

  return response.data;
}

export const getPsTokenBuyCart = async (projectId, loginToken, cartId) => {
  const url = `https://store.xsolla.com/api/v2/project/${projectId}/payment/cart/${cartId}`;
  const data = {
    sandbox: true,
    settings: {
      ui: {
        theme: 'dark'
      }
    }
  };
  const params = {
    headers: {
      Authorization: "Bearer " + loginToken
    }
  };

  const response = await axios.post(url, data, params);

  return response.data;
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

export const getVirtualCurrencyBalance = async (projectId, loginToken) => {
  const url = `https://store.xsolla.com/api/v2/project/${projectId}/user/virtual_currency_balance`;
  const params = {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    }
  }

  const response = await axios.get(url, params);

  return response.data;
}
