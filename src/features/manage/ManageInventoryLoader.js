import axios from 'axios';

export const loadVirtualItems = async projectID => {
  const url = `https://store.xsolla.com/api/v2/project/${projectID}/items/virtual_items`;
  const response = await axios.get(url);

  return response.data.items;
}

export const loadVirtualCurrencies = async projectID => {
  const url = `https://store.xsolla.com/api/v2/project/${projectID}/items/virtual_currency`;
  const response = await axios.get(url);

  return response.data.items;
}

export const rewardItems = async data => {
  const url = 'https://livedemo.xsolla.com/store-demo-api/index.php';
  const response = await axios.post(url, data);

  return response.data;
}
