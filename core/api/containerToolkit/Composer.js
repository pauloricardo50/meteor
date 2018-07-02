import { Meteor } from 'meteor/meteor';
import { compose } from 'recompose';

class Composer {
  compose = (...args) => compose(...args);
}

const composer = new Composer();

if (Meteor.isTest) {
  const sinon = require('sinon');
  sinon.spy(composer, 'compose');
}

export default composer;
