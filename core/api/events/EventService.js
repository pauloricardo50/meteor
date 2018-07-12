import { Meteor } from 'meteor/meteor';

const IS_LOGGING = true;

export default class EventService {
  constructor({ emmitter }) {
    this.emmitter = emmitter;
    // contains arrays of listener functions, grouped by event names
    this.listenerFunctions = {};
    this.addErrorListener();
  }

  emit(eventName, params) {
    this.logEmittedEvent(eventName, params);
    this.emmitter.emit(eventName, params);
  }

  emitMethod({ name }, params) {
    this.emit(name, params);
  }

  addListener(eventName, listenerFunction) {
    this.emmitter.addListener(eventName, (params) => {
      this.logListener(eventName, params);
      listenerFunction(params);
    });

    const listenersForEvent = this.listenerFunctions[eventName] || [];

    this.listenerFunctions[eventName] = [
      ...listenersForEvent,
      listenerFunction,
    ];
  }

  addMethodListener(
    {
      config: { name },
    },
    listenerFunction,
  ) {
    this.addListener(name, listenerFunction);
  }

  addErrorListener() {
    this.addListener('error', (error) => {
      console.log('An error occured in an event listener:');
      console.log(error);
      throw error;
    });
  }

  logEmittedEvent(eventName, params) {
    if (IS_LOGGING && Meteor.isDevelopment && !Meteor.isTest) {
      console.log(`Event "${eventName}" triggered with params:`);
      console.log(params);
    }
  }

  logListener(eventName, params) {
    if (IS_LOGGING && Meteor.isDevelopment && !Meteor.isTest) {
      console.log(`Event "${eventName}" listened to with params:`);
      console.log(params);
    }
  }

  getListenerFunctions(eventName) {
    return this.listenerFunctions[eventName] || [];
  }
}
