import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';
import connectRoute from 'connect-route';
import Fiber from 'fibers';

import * as defaultMiddlewares from './middlewares';
import { stringToLiteral } from './helpers';

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
        const func = this.endpoints[endpoint][method];

        this.registerEndpoint(finalEndpoint, func, method);
      });
    });
  }

  registerEndpoint(endpoint, func, method) {
    WebApp.connectHandlers.use(Meteor.bindEnvironment(connectRoute((router) => {
      router[method.toLowerCase()](endpoint, (req, res, next) => {
        Fiber(() => {
          try {
            const { params = {} } = req;
            const formattedParams = Object.keys(params).reduce(
              (object, key) => ({
                ...object,
                [key]: stringToLiteral(params[key]),
              }),
              {},
            );
            Promise.resolve()
              .then(() =>
                func({
                  user: req.user,
                  body: req.body,
                  query: req.query,
                  params: formattedParams,
                }))
              .then(result => this.handleSuccess(result, res))
              .catch(next);
          } catch (error) {
            next(error);
          }
        }).run();
      });
    })));
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
