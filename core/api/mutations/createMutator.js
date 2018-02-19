import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import EventService from '../events';

const INVALID_MUTATION_OPTIONS = 'INVALID_MUTATION_OPTIONS';
const MUTATION_ERROR = 'MUTATION_ERROR';

export const beforeLogger = (callParameters, name) => {
  if (Meteor.isDevelopment && !Meteor.isTest) {
    console.log(`Executing method ${name} with the following params:`);
    console.log(callParameters);
  }
};

export const afterLogger = (result, name) => {
  if (Meteor.isDevelopment && !Meteor.isTest) {
    console.log(`Executed ${name} and got result:`);
    console.log(result);
  }
};

export const validateMutationOptions = ({ name, params }) => {
  if (!name || typeof name !== 'string') {
    throw new Meteor.Error(INVALID_MUTATION_OPTIONS, 'name has to be a string');
  }

  if (params) {
    Object.keys(params).forEach((param) => {
      const { type } = params[param];
      if (!type) {
        throw new Meteor.Error(
          INVALID_MUTATION_OPTIONS,
          `you have to provide a type for parameter: "${param}" in ${name}`,
        );
      }
    });
  }
};

export const checkParams = (callParameters, params) => {
  check(
    callParameters,
    Object.keys(params).reduce((matchPattern, param) => {
      const { optional, type } = params[param];

      // Return a Match Pattern and check for optionals
      return {
        ...matchPattern,
        [param]: optional ? Match.Optional(type) : type,
      };
    }, {}),
  );
};

const createMutator = (options, functionBody) => {
  validateMutationOptions(options);
  const { name, params } = options;

  Meteor.methods({
    [name](callParameters) {
      beforeLogger(callParameters, name);
      checkParams(callParameters, params, name);

      let result;
      try {
        result = functionBody(callParameters);
        EventService.emitMutation(options, callParameters);
      } catch (error) {
        throw error;
      }

      afterLogger(result, name);

      return result;
    },
  });
};

export default createMutator;
