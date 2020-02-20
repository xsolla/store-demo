import axios from 'axios';

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
      sandbox: true,
      settings: {
        ui: {
          theme: 'dark'
        }
      }
    }
  };
  return axios(opts);
}

export const loadVirtualItems = async (projectID, token) => {
  const URL = `https://store.xsolla.com/api/v1/project/${projectID}/items/groups`
  const response = await axios.get(
    URL,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const [...items] = await Promise.all(response.data.groups.map(g => loadVirtualItemsByGroup(projectID, g.external_id)));
  return items.reduce((acc, x) => acc.concat(x), [])
};

const loadVirtualItemsByGroup = async (projectID, groupID) => {
  const URL = `https://store.xsolla.com/api/v2/project/${projectID}/items/virtual_items/group/${groupID}`
  const response = await axios.get(URL);

  return response.data.items;
}
