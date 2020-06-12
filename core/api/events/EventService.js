import { Meteor } from 'meteor/meteor';

const IS_LOGGING = !Meteor.isProduction;

const EVENT_BLACKLIST = ['analyticsPage', 'analyticsLogin'];

export default class EventService {
  constructor({ emmitter }) {
    this.emmitter = emmitter;
    // contains arrays of listener functions, grouped by event names
    this.listenerFunctions = {};
    this.addErrorListener();
  }

  emit(eventName, ...args) {
    this.emmitter.emit(eventName, ...args);
  }

  getBeforeMethodEventName(name) {
    return `__before_${name}`;
  }

  emitBeforeMethod({ name }, ...args) {
    this.emit(this.getBeforeMethodEventName(name), ...args);
  }

  emitAfterMethod({ name }, ...args) {
    this.emit(name, ...args);
  }

  addListener(eventName, listenerFunction) {
    this.emmitter.addListener(eventName, (...args) => {
      this.logListener(eventName, ...args);
      listenerFunction(...args);
    });

    const listenersForEvent = this.listenerFunctions[eventName] || [];

    this.listenerFunctions[eventName] = [
      ...listenersForEvent,
      listenerFunction,
    ];
  }

  addBeforeMethodListener(methods, listenerFunction) {
    if (Array.isArray(methods)) {
      return methods.map(method => {
        this.checkMethod(method);
        const {
          config: { name },
        } = method;
        this.addListener(this.getBeforeMethodEventName(name), listenerFunction);

        return name;
      });
    }

    this.checkMethod(methods);
    const {
      config: { name },
    } = methods;
    this.addListener(this.getBeforeMethodEventName(name), listenerFunction);

    return name;
  }

  addAfterMethodListener(methods, listenerFunction) {
    if (Array.isArray(methods)) {
      return methods.map(method => {
        this.checkMethod(method);
        const {
          config: { name },
        } = method;
        this.addListener(name, listenerFunction);

        return name;
      });
    }

    this.checkMethod(methods);
    const {
      config: { name },
    } = methods;
    this.addListener(name, listenerFunction);

    return name;
  }

  checkMethod(method) {
    if (!method || !method.config) {
      throw new Error('Method does not exist in EventService');
    }
  }

  addErrorListener() {
    this.addListener('error', error => {
      console.log('An error occured in an event listener:');
      console.log(error);
      throw error;
    });
  }

  logListener(eventName, ...args) {
    if (IS_LOGGING && !Meteor.isTest && !EVENT_BLACKLIST.includes(eventName)) {
      console.log(`Event "${eventName}" listened to with args:`);
      args.forEach(arg => console.log(arg));
    }
  }

  getListenerFunctions(eventName) {
    return this.listenerFunctions[eventName] || [];
  }

  removeListener(eventName, listener) {
    this.emmitter.removeListener(eventName, listener);
  }

  removeAllListeners(eventName) {
    this.emmitter.removeAllListeners(eventName);
  }
}
