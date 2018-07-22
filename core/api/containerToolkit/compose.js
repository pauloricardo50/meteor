import { Meteor } from 'meteor/meteor';
import { compose as originalCompose } from 'recompose';

let compose = originalCompose;

if (Meteor.isTest) {
  const sinon = require('sinon');
  compose = sinon.stub().callsFake((...args) => originalCompose(...args));
}

export default compose;
