import { init } from 'store-js-sdk/src/init';

class EntitlementApi {
  constructor(actions, projectId, loginToken) {
    this.actions = actions;
    this.projectId = projectId;
    this.loginToken = loginToken;
  }

  loadEntitlement = async () => {
    const url = '/v2/projects/entitlement';
    const response = await this.actions.get(url);

    return convertEntitlements(response.data);
  };

  redeem = async (key, sku) => {
    init({ projectId: this.projectId, version: 'v2' });
    const url = '/v1/game_delivery/xsolla_login/redeem_key';
    const data = {
      project_id: this.projectId,
      digital_content_sku: sku,
      language: 'en',
      key,
    };

    await this.actions.post(url, data);
  };
}

const convertEntitlements = items =>
  items.map(x => ({
    sku: x.digital_content_sku,
    name: x.name,
    imageUrl: x.image_url,
    description: x.description,
    projectId: x.project_id,
  }));

export { EntitlementApi };
