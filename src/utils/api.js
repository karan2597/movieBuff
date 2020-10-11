import axios from 'axios';

import VError from 'verror';

const getRequestUrl = ({ url, params }) => {
  let requestUrl = url;
  if (params && Object.keys(params).length) {
    Object.keys(params).forEach((param) => {
      requestUrl = requestUrl.replace(`:${param}`, params[param]);
    });
  }
  return requestUrl;
};

const apiMethod = ({
  url, method, params, query, config,
}) => {
  if (url && method) {
    const requestUrl = getRequestUrl({ url, params });
    switch (method) {
      case 'GET':
        return axios.get(requestUrl, { params: query, ...config });
      default:
        throw new VError(`Method ${method} not supported`);
    }
  }
  throw new VError(`Required Params missing, url: ${url}, method: ${method}`);
};

export default apiMethod;
