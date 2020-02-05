//
import { compose } from 'recompose';
import isArray from 'lodash/isArray';
import difference from 'lodash/difference';

const middlewareManagerHash = [];
const CLASS_METHODS_TO_EXCLUDE = [
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toString',
  'valueOf',
  'toLocaleString',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
];

// Careful, methods starting with "_" will not be wrapped by middleware,
// except if you use a middlewareObject
class MiddlewareManager {
  constructor(target, middlewareObjects) {
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

  applyToAllMethods(_middlewares, omit) {
    const middlewares = this.arrayify(_middlewares);
    const methods = this.getAllMethodNames(this._target);

    methods
      .filter(name => {
        if (omit) {
          return !omit.includes(name);
        }
        return true;
      })
      .forEach(method => this.applyToMethod(method, middlewares));

    return this;
  }

  getAllMethodNames(obj = {}, stop) {
    const methodNames = [];
    let proto = Object.getPrototypeOf(obj);
    while (proto && proto !== stop) {
      Object.getOwnPropertyNames(proto).forEach(name => {
        if (name !== 'constructor') {
          if (this.hasMethod(proto, name)) {
            methodNames.push(name);
          }
        }
      });
      proto = Object.getPrototypeOf(proto);
    }
    return difference(methodNames, CLASS_METHODS_TO_EXCLUDE);
  }

  hasMethod(obj, name) {
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    return !!desc && typeof desc.value === 'function';
  }

  applyToMethod(methodName, _middlewares) {
    const middlewares = this.arrayify(_middlewares);

    if (
      typeof methodName === 'string' &&
      !this.stringStartsWithUnderscore(methodName)
    ) {
      const method = this._methods[methodName] || this._target[methodName];
      if (typeof method === 'function') {
        this._methods[methodName] = method;

        if (
          this._methodMiddlewares[methodName] === undefined ||
          !isArray(this._methodMiddlewares[methodName])
        ) {
          this._methodMiddlewares[methodName] = [];
        }

        middlewares.forEach(
          middleware =>
            typeof middleware === 'function' &&
            this._methodMiddlewares[methodName].push(middleware(this._target)),
        );
        this._target[methodName] = compose(
          ...this._methodMiddlewares[methodName],
        )(method.bind(this._target));
      }
    }

    return this;
  }

  stringStartsWithUnderscore(string) {
    return /^_+|_+$/g.test(string);
  }

  useObjectMiddleware(_objectMiddlewares) {
    const objectMiddlewares = this.arrayify(_objectMiddlewares);

    Array.prototype.slice.call(objectMiddlewares).forEach(arg => {
      // A middleware object can specify target functions within middlewareMethods (Array).
      // e.g. obj.middlewareMethods = ['method1', 'method2'];
      // only method1 and method2 will be the target function.
      typeof arg === 'object' &&
        (arg.middlewareMethods || Object.keys(arg)).forEach(key => {
          typeof arg[key] === 'function' &&
            this.applyToMethod(key, arg[key].bind(arg));
        });
    });

    return this;
  }

  arrayify(maybeArray) {
    return isArray(maybeArray) ? maybeArray : [maybeArray];
  }
}

export default MiddlewareManager;
