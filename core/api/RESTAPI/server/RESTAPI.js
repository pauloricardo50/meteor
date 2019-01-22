import { WebApp } from 'meteor/webapp';
import * as defaultMiddlewares from './middlewares';
import { getRequestMethod } from './helpers';

export default class RESTAPI {
  constructor({
    rootPath = '/api',
    preMiddlewares = defaultMiddlewares.preMiddlewares,
    postMiddlewares = defaultMiddlewares.postMiddlewares,
  } = {}) {
    this.rootPath = rootPath;
    this.preMiddlewares = preMiddlewares;
    this.postMiddlewares = postMiddlewares;
    this.endpoints = {};
  }

  reset() {
    WebApp.connectHandlers.stack = [];
  }

  start() {
    this.reset();
    this.registerMiddlewares(this.preMiddlewares);
    this.registerEndpoints();
    this.registerMiddlewares(this.postMiddlewares);
  }

  registerMiddlewares(middlewares) {
    middlewares.forEach((middleware) => {
      WebApp.connectHandlers.use(middleware);
    });
  }

  makeEndpoint = path => this.rootPath + path;

  registerEndpoints() {
    const endpoints = Object.keys(this.endpoints);

    endpoints.forEach((endpoint) => {
      const methods = Object.keys(this.endpoints[endpoint]);

      methods.forEach((method) => {
        const finalEndpoint = this.makeEndpoint(endpoint);
        const func = this.endpoints[endpoint][method];

        this.registerEndpoint(finalEndpoint, func, method);
      });
    });
  }

  registerEndpoint(endpoint, func, method) {
    WebApp.connectHandlers.use(endpoint, (req, res, next) => {
      if (getRequestMethod(req) !== method) {
        // Not the right method, pass to the following middlewares
        next();
        return;
      }

      try {
        Promise.resolve()
          .then(() => func({ user: req.user, body: req.body }))
          .then(result => this.handleSuccess(result, res))
          .catch(next);
      } catch (error) {
        next(error);
      }
    });
  }

  handleSuccess(result = '', res) {
    const stringified = JSON.stringify(result);
    res.setHeader('Content-Type', 'application/json');
    res.write(stringified);

    res.end();
  }

  addEndpoint(path, method, handler) {
    if (this.endpoints[path] && this.endpoints[path][method]) {
      throw new Error(`Endpoint "${path}" for method "${method}" already exists in REST API`);
    }

    this.endpoints[path] = {
      ...(this.endpoints[path] || {}),
      [method]: handler,
    };
  }
}
