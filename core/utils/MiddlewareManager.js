// @flow
import { compose } from 'recompose';
import isArray from 'lodash/isArray';

const middlewareManagerHash = [];

class MiddlewareManager {
  /**
   * @param {object} target The target object.
   * @param {...object} middlewareObjects Middleware objects.
   * @return {object} this
   */
  constructor(target: Object, middlewareObjects) {
    let instance = middlewareManagerHash.find(key => key._target === target);
    // a target can only has one MiddlewareManager instance
    if (instance === undefined) {
      this._target = target;
      this._methods = {};
      this._methodMiddlewares = {};
      middlewareManagerHash.push(this);
      instance = this;
    }

    if (middlewareObjects) {
      instance.useObjectMiddleware(middlewareObjects);
    }

    return instance;
  }

  applyToMethod(methodName, _middlewares) {
    const middlewares = this.arrayify(_middlewares);

    if (typeof methodName === 'string' && !/^_+|_+$/g.test(methodName)) {
      const method = this._methods[methodName] || this._target[methodName];
      if (typeof method === 'function') {
        this._methods[methodName] = method;
        if (this._methodMiddlewares[methodName] === undefined) {
          this._methodMiddlewares[methodName] = [];
        }
        middlewares.forEach(middleware => typeof middleware === 'function'
            && this._methodMiddlewares[methodName].push(middleware(this._target)));
        this._target[methodName] = compose(...this._methodMiddlewares[methodName])(method.bind(this._target));
      }
    }
  }

  /**
   * Apply (register) middleware functions to the target function or apply (register) middleware objects.
   * If the first argument is a middleware object, the rest arguments must be middleware objects.
   *
   * @param {string|object} methodName String for target function name, object for a middleware object.
   * @param {...function|...object} middlewares The middleware chain to be applied.
   * @return {object} this
   */
  use(methodName, middlewares) {
    this.applyToMethod(methodName, middlewares);

    return this;
  }

  useObjectMiddleware(_objectMiddlewares) {
    const objectMiddlewares = this.arrayify(_objectMiddlewares);

    Array.prototype.slice.call(objectMiddlewares).forEach((arg) => {
      // A middleware object can specify target functions within middlewareMethods (Array).
      // e.g. obj.middlewareMethods = ['method1', 'method2'];
      // only method1 and method2 will be the target function.
      typeof arg === 'object'
        && (arg.middlewareMethods || Object.keys(arg)).forEach((key) => {
          typeof arg[key] === 'function'
            && this.applyToMethod(key, arg[key].bind(arg));
        });
    });
  }

  arrayify(maybeArray) {
    return isArray(maybeArray) ? maybeArray : [maybeArray];
  }
}

export default MiddlewareManager;
