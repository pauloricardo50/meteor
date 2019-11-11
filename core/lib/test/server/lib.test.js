import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Meteor } from 'meteor/meteor';

const globalThis = require('../../getGlobalThis.js').default();

global.globalThis = globalThis;

Meteor.methods({
  resetDatabase() {
    resetDatabase();
  },
});
