import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

const INVALID_MUTATION_OPTIONS = 'INVALID_MUTATION_OPTIONS';

export const beforeLogger = (callParameters, name) => {
  if (Meteor.isDevelopment) {
    console.log(`Executing method ${name} with the following params:`);
    console.log(callParameters);
  }
};

export const afterLogger = (result, name) => {
  if (Meteor.isDevelopment) {
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
          `you have to provide a type for parameter: ${param}`,
        );
      }
    });
  }
};

export const checkParams = (callParameters, params) => {
  Object.keys(params).forEach((param) => {
    const { type, optional } = params[param];
    const paramValue = callParameters[param];

    if (optional === true) {
      check(paramValue, Match.Optional(type));
    } else {
      check(paramValue, type);
    }
  });
};

const createMutator = (options, functionBody) => {
  validateMutationOptions(options);
  const { name, params } = options;

  Meteor.methods({
    [name](callParameters) {
      beforeLogger(callParameters, name);
      checkParams(callParameters, params);
      const result = functionBody(callParameters);
      afterLogger(result, name);
    },
  });
};

export default createMutator;
