import { WebApp } from 'meteor/webapp';
import {
  bodyParserJSON,
  bodyParserUrlEncoded,
  filter,
  authenticate,
} from './middlewares';

export default class RESTAPI {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.middlewares = [
      filter,
      bodyParserJSON,
      bodyParserUrlEncoded,
      authenticate,
    ];
    this.endpoints = [];
    this.middlewares.forEach(middleware =>
      this.connectHandlers({ handler: middleware(this) }));
  }

  addEndpoint(endpoint) {
    this.endpoints = [
      ...this.endpoints,
      ...(this.endpointExists(endpoint) ? [] : [endpoint]),
    ];
  }

  endpointExists(endpoint) {
    return this.endpoints.some(({ path, method }) =>
      path === endpoint.path && method === endpoint.method);
  }

  getRequestPath(req) {
    const { _parsedUrl: parsedUrl } = req;
    return parsedUrl && parsedUrl.path;
  }

  getRequestMethod(req) {
    return req.method;
  }

  connectHandlers({ path, method, handler }) {
    WebApp.connectHandlers.use(path || this.rootPath, handler);
    this.addEndpoint({ path, method } || { path: this.rootPath, method });
  }

  sendResponse({ res, data: { statusCode, body } }) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    return res.end(JSON.stringify(body));
  }
}

export const sendResponse = RESTAPI.prototype.sendResponse;
export const getRequestPath = RESTAPI.prototype.getRequestPath;
export const getRequestMethod = RESTAPI.prototype.getRequestMethod;
