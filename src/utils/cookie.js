const eatCookie = () => {
  const getCookie = o => {
    for (var e = o + '=', n = decodeURIComponent(document.cookie).split(';'), t = 0; t < n.length; t++) {
      for (var i = n[t]; ' ' === i.charAt(0); ) i = i.substring(1);
      if (0 === i.indexOf(e)) return i.substring(e.length, i.length);
    }
    return '';
  };
  const setCookie = (o, e) => {
    var n = new Date();
    n.setTime(n.getTime() + 864e5);
    var t = 'expires=' + n.toUTCString();
    document.cookie = o + '=' + e + ';' + t + ';path=/';
  };

  function getQueryParams(o) {
    o = o.split('+').join(' ');
    for (var e, n = {}, t = /[?&]?([^=]+)=([^&]*)/g; (e = t.exec(o)); )
      n[decodeURIComponent(e[1])] = decodeURIComponent(e[2]);
    return n;
  }

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

export default function Cookie(projectId) {
  return Number(process.env.REACT_APP_DEMO_PROJECT_ID) === projectId
    ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5NjIyMzQwNDgsImlzcyI6Imh0dHBzOi8vbG9naW4ueHNvbGxhLmNvbSIsI' +
        'mlhdCI6MTU2MjE0NzY0OCwidXNlcm5hbWUiOiJ4c29sbGEiLCJ4c29sbGFfbG9naW5fYWNjZXNzX2tleSI6IjA2SWF2ZHpDeEVHbm5aMTlp' +
        'LUc5TmMxVWFfTWFZOXhTR3ZEVEY4OFE3RnMiLCJzdWIiOiJkMzQyZGFkMi05ZDU5LTExZTktYTM4NC00MjAxMGFhODAwM2YiLCJlbWFpbCI' +
        '6InN1cHBvcnRAeHNvbGxhLmNvbSIsInR5cGUiOiJ4c29sbGFfbG9naW4iLCJ4c29sbGFfbG9naW5fcHJvamVjdF9pZCI6ImU2ZGZhYWM2LTc' +
        '4YTgtMTFlOS05MjQ0LTQyMDEwYWE4MDAwNCIsInB1Ymxpc2hlcl9pZCI6MTU5MjR9.GCrW42OguZbLZTaoixCZgAeNLGH2xCeJHxl8u8Xn2aI'
    : eatCookie();
}

export function eraseCookie(o) {
  return (document.cookie = o + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;');
}

export function parseJwt(o) {
  let base64Url = o.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}
