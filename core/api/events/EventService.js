import { EventEmitter } from 'events';
import { Meteor } from 'meteor/meteor';

const IS_LOGGING = false;

export class EventService {
  constructor({ emmitter }) {
    this.emmitter = emmitter;
    this.disabled = {};
    this.addErrorListener();
  }

  emit(eventName, params) {
    this.logEmittedEvent(eventName, params);
    this.emmitter.emit(eventName, params);
  }

  emitMutation({ name }, params) {
    this.emit(name, params);
  }

  addListener(eventName, listenerFunction, category) {
    this.emmitter.addListener(eventName, (params) => {
      if (!this.disabled[category]) {
        this.logListener(eventName, params, category);
        listenerFunction(params);
      }
    });
  }

  addMutationListener({ name }, listenerFunction, category) {
    if (!name) {
      throw new Meteor.Error('Invalid new listener, please provide a mutationObject with a name');
    }
    this.addListener(name, listenerFunction, category);
  }

  createCategoryListenerAdder(category) {
    return (eventName, listenerFunction) =>
      this.addListener(eventName, listenerFunction, category);
  }

  createCategoryMutationListenerAdder(category) {
    return (mutationOptions, listenerFunction) =>
      this.addMutationListener(mutationOptions, listenerFunction, category);
  }

  disableListenerCategory(category) {
    this.disabled[category] = true;
  }

  enableListenerCategory(category) {
    this.disabled[category] = false;
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

  static logListener(eventName, params, category) {
    if (IS_LOGGING && Meteor.isDevelopment) {
      console.log(`Event "${eventName}" listened to ${
        category ? `from category "${category}"` : ''
      }`);
      console.log(params);
    }
  }
}

const defaultEmmitter = new EventEmitter();
export default new EventService({ defaultEmmitter });
