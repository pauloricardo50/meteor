import { EventEmitter } from 'events';
import { Meteor } from 'meteor/meteor';

const IS_LOGGING = false;

export class EventService {
  constructor({ emmitter }) {
    this.emmitter = emmitter;
    this.addErrorListener();
  }

  emit(eventName, params) {
    this.logEmittedEvent(eventName, params);
    this.emmitter.emit(eventName, params);
  }

  emitMutation({ name }, params) {
    this.emit(name, params);
  }

  addListener(eventName, listenerFunction) {
    this.emmitter.addListener(eventName, (params) => {
      this.logListener(eventName, params);
      listenerFunction(params);
    });
  }

  addMutationListener({ name }, listenerFunction) {
    if (!name) {
      throw new Meteor.Error('Invalid new listener, please provide a mutationObject with a name');
    }
    this.addListener(name, listenerFunction);
  }

  addErrorListener() {
    this.addListener('error', (error) => {
      console.log('An error occured in an event listener:');
      console.log(error);
      throw error;
    });
  }

  static logEmittedEvent(eventName, params) {
    if (IS_LOGGING && Meteor.isDevelopment) {
      console.log(`Event "${eventName}" triggered with params:`);
      console.log(params);
    }
  }

  static logListener(eventName, params) {
    if (IS_LOGGING && Meteor.isDevelopment) {
      console.log(`Event "${eventName}" listened to with params:`);
      console.log(params);
    }
  }
}

const defaultEmmitter = new EventEmitter();
export default new EventService({ emmitter: defaultEmmitter });
