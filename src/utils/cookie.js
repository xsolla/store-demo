import { DEMO_PROJECT_ID, DEMO_TOKEN } from './constants';

export const setCookie = (o, e) => {
  var n = new Date();
  n.setTime(n.getTime() + 864e5);
  var t = 'expires=' + n.toUTCString();
  document.cookie = o + '=' + e + ';' + t + ';path=/';
};

export const getCookie = o => {
  for (var e = o + '=', n = decodeURIComponent(document.cookie).split(';'), t = 0; t < n.length; t++) {
    for (var i = n[t]; ' ' === i.charAt(0); ) i = i.substring(1);
    if (0 === i.indexOf(e)) return i.substring(e.length, i.length);
  }
  return '';
};

export const getQueryParams = o => {
    o = o.split('+').join(' ');
    for (var e, n = {}, t = /[?&]?([^=]+)=([^&]*)/g; (e = t.exec(o)); )
        n[decodeURIComponent(e[1])] = decodeURIComponent(e[2]);
    return n;
};

export const eatCookie = () => {
  let o;
  if (window.location.search) {
    o = getQueryParams(window.location.search).token;
  }
  if (o) {
    setCookie('xsolla_login_token', o);
    window.history.pushState('', '', document.location.pathname);
  } else {
    o = getCookie('xsolla_login_token');
  }
  if (o && o !== 'undefined') {
    return o;
  } else {
    return null;
  }
};

export function eraseCookie(o) {
  return (document.cookie = o + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;');
}

export function parseJwt(o) {
  let base64Url = o.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

export default function Cookie(projectId) {
  return DEMO_PROJECT_ID === projectId ? DEMO_TOKEN : eatCookie();
}
