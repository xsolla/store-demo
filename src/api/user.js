import { parseJwt, eraseCookie } from '../utils/cookie';

class UserApi {
  constructor(actions, projectId, token) {
    this.actions = actions;
    this.projectId = projectId;
    this.token = token;
  }

  getUser = async () => {
    const userInfo = this.token ? parseJwt(this.token) : null;
    return userInfo ? convertUser(userInfo) : null;
  };

  logout = async () => {
    eraseCookie('xsolla_login_token', null);
    eraseCookie('xsolla_last_click_id', null);
  };

  loadBalances = async () => {
    const url = `/v2/project/${this.projectId}/user/virtual_currency_balance`;
    const response = await this.actions.get(url);

    return convertVirtualBalances(response.data.items);
  };
}

const convertUser = user => ({
  email: user.email,
  loginId: user.xsolla_login_project_id,
});

const convertVirtualBalances = items =>
  items.map(x => ({
    sku: x.sku,
    name: x.name,
    type: x.type,
    description: x.description,
    imageUrl: x.image_url,
    amount: x.amount,
  }));

export { UserApi };
