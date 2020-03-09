import { parseJwt, eraseCookie } from '../utils/cookie';

class UserApi {
  constructor(actions, projectId, token, loginWidget) {
    this.actions = actions;
    this.projectId = projectId;
    this.token = token;
    this.loginWidget = loginWidget;
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

// var urlParams = new URLSearchParams(new URL(window.location.href.replace('#/', '')).search);

// var xProjectId;
// if (urlParams && urlParams.get('project_id')) {
//   xProjectId = parseInt(urlParams.get('project_id'));
//   localStorage.setItem('xsolla_react_store_project', xProjectId);
// } else {
//   xProjectId = localStorage.getItem('xsolla_react_store_project') || '44056';
//   xProjectId = parseInt(xProjectId);
// }

// var xLoginId;
// if (urlParams && urlParams.get('login_id')) {
//   xLoginId = urlParams.get('login_id');
//   localStorage.setItem('xsolla_react_store_login', xLoginId);
// } else {
//   xLoginId = localStorage.getItem('xsolla_react_store_login') || 'e6dfaac6-78a8-11e9-9244-42010aa80004';
// }

// var mainURL = 'https://xsolla.github.io/store-demo/';

// XL.init({
//   projectId: xLoginId,
//   loginUrl: mainURL,
//   locale: 'en_US',
//   onlyWidgets: true,
//   fields: ['email'],
//   theme: 'https://cdn3.xsolla.com/files/uploaded/15924/bfe7e2a5a75fb6f53d04de645ec7c542.css',
// });
// const element_id = 'xl_auth';
// const options = {
//   width: 600,
//   height: 550,
// };

// function XloginInit() {
//   XL.AuthWidget(element_id, options);
// }
