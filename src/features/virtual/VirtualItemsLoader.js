import axios from 'axios';

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

  const [...groups] = await Promise.all(response.data.groups.map(async g => {
    const virtualItemsByGroup = await loadVirtualItemsByGroup(projectID, g.external_id);
    return {
      groupID: g.external_id,
      groupName: g.name,
      items: virtualItemsByGroup
    };
  }));

  return groups;
};

const loadVirtualItemsByGroup = async (projectID, groupID) => {
  const URL = `https://store.xsolla.com/api/v2/project/${projectID}/items/virtual_items/group/${groupID}`
  const response = await axios.get(URL);

  return response.data.items;
}
