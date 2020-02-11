import axios from 'axios';

export const loadVirtualCurrencies = async (projectID, token) => {
  const URL = `https://store.xsolla.com/api/v2/project/${projectID}/items/virtual_currency/package`;
  const response = await axios.get(URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.items;
};
