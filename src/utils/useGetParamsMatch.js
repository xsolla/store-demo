import {useLocation} from 'react-router-dom';

const useGetParamsMatch = (params = [], paramsConverter = null) => {
  let query = new URLSearchParams(useLocation().search);

  let match = {
    params: {}
  };

  for (let i = 0; i < params.length; i++) {
    const paramValue = query.get(params[i]);
    if (paramValue) {
      const paramName = paramsConverter ? paramsConverter(params[i]) : params[i];
      match.params[paramName] = paramValue;
    } else {
      match = null;
      break;
    }
  }

  return match;
};

export {useGetParamsMatch};
