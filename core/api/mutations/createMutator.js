import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

const INVALID_MUTATION_OPTIONS = 'INVALID_MUTATION_OPTIONS';
const MUTATION_ERROR = 'MUTATION_ERROR';

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
          `you have to provide a type for parameter: "${param}" in ${name}`,
        );
      }
    });
  }
};

export const checkParams = (callParameters, params, name) => {
  check(callParameters, Object);

  const expectedParamCount = Object.keys(params).length;
  const actualParamCount = Object.keys(callParameters).length;

  if (actualParamCount > expectedParamCount) {
    throw new Meteor.Error(`Too many params provided to mutation: ${name}. Expected ${expectedParamCount}, but received ${actualParamCount}`);
  }

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
    [name](callParameters = {}) {
      beforeLogger(callParameters, name);
      checkParams(callParameters, params, name);
      let result;
      try {
        result = functionBody(callParameters);
        // Emit event here
      } catch (error) {
        throw new Meteor.Error(MUTATION_ERROR, `Error in ${name}`, error);
      }
      afterLogger(result, name);
    },
  });
};

export default createMutator;
