import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import connectRoute from 'connect-route';
import Fiber from 'fibers';
import { compose } from 'recompose';

import {
  setClientMicroservice,
  setClientUrl,
} from '../../../utils/server/getClientUrl';
import {
  getRequestType,
  logRequest,
  setAPIUser,
  setIsAPI,
  trackRequest,
} from './helpers';
import * as defaultMiddlewares from './middlewares';
import { HTTP_STATUS_CODES, RESPONSE_ALREADY_SENT } from './restApiConstants';

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
    middlewares.forEach(middleware => {
      WebApp.connectHandlers.use(
        this.rootPath,
        middleware(this.getEndpointsOptions()),
      );
    });
  }

  makeEndpoint = path => this.rootPath + path;

  registerEndpoints() {
    const endpoints = Object.keys(this.endpoints);

    endpoints.forEach(endpoint => {
      const methods = Object.keys(this.endpoints[endpoint]);

      methods.forEach(method => {
        const finalEndpoint = this.makeEndpoint(endpoint);
        const { handler } = this.endpoints[endpoint][method];

        this.registerEndpoint(finalEndpoint, handler, method);
      });
    });
  }

  wrapHandler(handler) {
    return (req, res, next) => {
      Fiber(() => {
        const { headers = {} } = req;
        const { host, location } = headers;
        req.startTime = new Date().getTime();

        setClientMicroservice('api');
        setClientUrl({ host, href: location });
        setIsAPI();
        setAPIUser(req.user);

        try {
          Promise.resolve()
            .then(() =>
              handler({
                req,
                user: req.user,
                body: req.body,
                query: req.query,
                params: req.params,
                files: req.files,
                simpleAuthParams: req.simpleAuthParams,
                res,
              }),
            )
            .then(result => {
              this.handleSuccess(result, req, res);
            })
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
    )(router => {
      router[method.toLowerCase()](endpoint, this.wrapHandler(handler));
    });
  }

  handleSuccess(result, req, res) {
    req.endTime = new Date().getTime();
    req.duration = req.endTime - req.startTime;
    const stringified = JSON.stringify(result || '');

    // LOGS
    logRequest({ req, result: stringified });

    trackRequest({ req, result: stringified });

    if (result !== RESPONSE_ALREADY_SENT) {
      const { status } = result;
      res.writeHead(status || HTTP_STATUS_CODES.OK, {
        'Content-Type': 'application/json',
      });
      res.write(stringified);

      res.end();
    }
  }

  addEndpoint(path, method, handler, options = {}) {
    if (this.endpoints[path] && this.endpoints[path][method]) {
      throw new Error(
        `Endpoint "${path}" for method "${method}" already exists in REST API`,
      );
    }

    if (!options.endpointName) {
      throw new Error(
        `Endpoint "${path}" for method "${method}" must have a name`,
      );
    }

    if (
      ![
        'rsaAuth',
        'simpleAuth',
        'basicAuth',
        'multipart',
        'noAuth',
        'customAuth',
      ].some(auth => Object.keys(options).indexOf(auth) >= 0)
    ) {
      throw new Error(
        `Endpoint "${path}" for method "${method}" must have a authentication type`,
      );
    }

    this.endpoints[path] = {
      ...(this.endpoints[path] || {}),
      [method]: { handler, options },
    };
  }

  getEndpointsOptions() {
    return Object.keys(this.endpoints).reduce(
      (options, path) => ({
        ...options,
        [this.makeEndpoint(path)]: Object.keys(this.endpoints[path]).reduce(
          (methods, method) => ({
            ...methods,
            [method]: { options: this.endpoints[path][method].options },
          }),
          {},
        ),
      }),
      {},
    );
  }
}
