import { EventEmitter } from 'events';
import { Meteor } from 'meteor/meteor';

const IS_LOGGING = true;

export class EventService {
  constructor({ emmitter }) {
    this.emmitter = emmitter;
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
  }

  addMethodListener({ config: { name } }, listenerFunction) {
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
}

const defaultEmmitter = new EventEmitter();
export default new EventService({ emmitter: defaultEmmitter });
