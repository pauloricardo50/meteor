import { Meteor } from 'meteor/meteor';

const IS_LOGGING = !Meteor.isProduction;

export default class EventService {
  constructor({ emmitter }) {
    this.emmitter = emmitter;
    // contains arrays of listener functions, grouped by event names
    this.listenerFunctions = {};
    this.addErrorListener();
  }

  emit(eventName, ...args) {
    this.logEmittedEvent(eventName, ...args);
    this.emmitter.emit(eventName, ...args);
  }

  emitMethod({ name }, ...args) {
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

  addMethodListener(methods, listenerFunction) {
    if (Array.isArray(methods)) {
      methods.forEach(({ config: { name } }) => {
        this.addListener(name, listenerFunction);
      });
    } else {
      const {
        config: { name },
      } = methods;
      this.addListener(name, listenerFunction);
    }
  }

  addErrorListener() {
    this.addListener('error', (error) => {
      console.log('An error occured in an event listener:');
      console.log(error);
      throw error;
    });
  }

  logEmittedEvent(eventName, ...args) {
    if (IS_LOGGING && !Meteor.isTest) {
      // console.log(`Event "${eventName}" triggered with params:`);
      // console.log(params);
    }
  }

  logListener(eventName, ...args) {
    if (IS_LOGGING && !Meteor.isTest) {
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
