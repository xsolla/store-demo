import axios from "axios";

export const purchaseItems = async data => {
  const url = `https://livedemo.xsolla.com/store-demo-api/index.php`;
  const response = await axios.post(url, data);

  return response.data;
};
