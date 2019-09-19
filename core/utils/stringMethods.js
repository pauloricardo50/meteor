import { Meteor } from 'meteor/meteor';

const shouldReverse = () => {
  if (Meteor.isServer) {
    const { getClientMicroservice } = require('./server/getClientUrl');
    return getClientMicroservice() !== 'app';
  }

  return Meteor.isClient && Meteor.microservice !== 'app';
};

const reverseFirstLastName = function () {
  const value = this.valueOf();

  if (!value || !shouldReverse()) {
    return value;
  }

  const parts = value.split(' ');

  if (parts.length === 1) {
    return value;
  }

  // assume it's more likely to have a single first name and multiple last names
  const [firstName, ...lastNames] = parts;
  return `${lastNames.join(' ')}, ${firstName}`;
};

export const editStringPrototype = () => {
  String.prototype.reverseFirstLastName = reverseFirstLastName;
};
