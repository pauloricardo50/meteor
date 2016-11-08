import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { check } from 'meteor/check';

import CreditRequests from './creditrequests.js';

export const insertRequest = new ValidatedMethod({
  name: 'creditrequests.insert',
  validate() {},
  run({ requestName }) {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to create a request');
    }

    const userRequests = CreditRequests.find({ userId: this.userId });

    if (userRequests.length > 3) {
      throw new Meteor.Error('maxRequests', 'Vous ne pouvez pas avoir plus de 3 requêtes à la fois');
    }

    // Set all existing requests to inactive
    userRequests.forEach((request) => {
      CreditRequests.update(request._id, {
        $set: { active: false },
      });
    });

    // Insert new active request
    CreditRequests.insert({
      requestName,
      active: true,
    });
  },
});

export const insertStarterRequest = new ValidatedMethod({
  name: 'creditrequests.insertStarter',
  validate({ salary, fortune, insuranceFortune, propertyValue, age, gender }) {
    check(salary, Number);
    check(fortune, Number);
    check(insuranceFortune, Number);
    check(propertyValue, Number);
    check(age, Number);
    if (gender !== undefined) {
      check(gender, String);
    }
  },
  run({ salary, fortune, insuranceFortune, propertyValue, age, gender }) {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn',
      'Must be logged in to create a request');
    }

    CreditRequests.insert({
      createdAt: new Date(),
      userId: this.userId,
      active: true,
      step: 0,
      salary,
      fortune,
      insuranceFortune,
      propertyValue,
      age,
      gender });
  },
});

export const incrementStep = new ValidatedMethod({
  name: 'creditrequests.incrementStep',
  validate({ id }) {
    check(id, String);

    // TODO: Verify that this request exists and is owned by the current user
  },
  run({ id }) {
    // Verify if user is logged in
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to increment step');
    }

    // TODO: Prevent increment if the current step is already at max step (5)

    CreditRequests.update(id, {
      $inc: { step: 1 },
    });
  },
});

export const updateValues = new ValidatedMethod({
  name: 'creditRequests.updateValues',
  validate: null,
  run({ object, id }) {
    if (!this.userId) {
      throw new Meteor.Error('notLoggedIn', 'Must be logged in to update a request');
    }

    CreditRequests.update(id, {
      $set: object,
    });
  },
});
