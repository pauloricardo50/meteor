import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import connectRoute from 'connect-route';
import Fiber from 'fibers';
import { compose } from 'recompose';

import * as defaultMiddlewares from './middlewares';
import { logRequest, trackRequest } from './helpers';
import { HTTP_STATUS_CODES } from './restApiConstants';

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
      WebApp.connectHandlers.use(this.rootPath, middleware);
    });
  }

  makeEndpoint = path => this.rootPath + path;

  registerEndpoints() {
    const endpoints = Object.keys(this.endpoints);

    endpoints.forEach((endpoint) => {
      const methods = Object.keys(this.endpoints[endpoint]);

      methods.forEach((method) => {
        const finalEndpoint = this.makeEndpoint(endpoint);
        const handler = this.endpoints[endpoint][method];

        this.registerEndpoint(finalEndpoint, handler, method);
      });
    });
  }

  wrapHandler(handler) {
    return (req, res, next) => {
      Fiber(() => {
        try {
          Promise.resolve()
            .then(() =>
              handler({
                user: req.user,
                body: req.body,
                query: req.query,
                params: req.params,
                files: req.files,
              }))
            .then(result => this.handleSuccess(result, req, res))
            .catch(next);
        } catch (error) {
          next(error);
        }
      }).run();
    };
  }

  registerEndpoint(endpoint, handler, method) {
    compose(
      WebApp.connectHandlers.use.bind(WebApp.connectHandlers),
      Meteor.bindEnvironment,
      connectRoute,
    )((router) => {
      router[method.toLowerCase()](endpoint, this.wrapHandler(handler));
    });
  }

  handleSuccess(result = '', req, res) {
    const { status } = result;
    const stringified = JSON.stringify(result);

    // LOGS
    logRequest({ req, result: stringified });

    trackRequest({ req, result: stringified });

    res.writeHead(status || HTTP_STATUS_CODES.OK, {
      'Content-Type': 'application/json',
    });
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
