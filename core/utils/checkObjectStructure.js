export const testErrors = {
  missingKey: (key, parentKey) => `Missing key ${key} from object ${parentKey}`,
  shouldBeArray: key => `Object key ${key} must be an array`,
  shouldBeObject: key => `Object key ${key} must be an object`,
  emptyArray: (key, parentKey) =>
    `Array at object key ${key} in ${parentKey} should not be empty`,
};

export const makeCheckObjectStructure = (errorMessages = testErrors) => {
  const {
    missingKey,
    shouldBeArray,
    shouldBeObject,
    emptyArray,
  } = errorMessages;
  let errors = [];

  const checkObjectStructure = ({ obj, template, parentKey }) => {
    const checkTemplate = (subObj, subTemplate, subParentKey) =>
      Object.keys(subTemplate).forEach(key => {
        if (subObj[key] === undefined) {
          if (typeof subTemplate[key] === 'object' && subTemplate[key].$or) {
            if (!subObj[subTemplate[key].$or]) {
              errors.push(missingKey(key, subParentKey || ''));
              return;
            }
          } else {
            errors.push(missingKey(key, subParentKey || ''));
            return;
          }
        }

        if (Array.isArray(subTemplate[key])) {
          if (!Array.isArray(subObj[key])) {
            errors.push(shouldBeArray(key));
          }
          if (subTemplate[key].length > 0 && subObj[key].length === 0) {
            errors.push(emptyArray(key, subParentKey));
          }

          if (
            subTemplate[key].length > 0 &&
            typeof subTemplate[key][0] === 'object' &&
            !Array.isArray(subTemplate[key][0])
          ) {
            subObj[key].forEach(object =>
              checkTemplate(object, subTemplate[key][0]),
            );
          }
        } else if (
          typeof subTemplate[key] === 'object' &&
          !Object.keys(subTemplate[key]).includes('$or')
        ) {
          if (typeof subObj[key] !== 'object' || Array.isArray(subObj[key])) {
            errors.push(shouldBeObject(key));
          } else {
            checkTemplate(subObj[key], subTemplate[key], key);
          }
        }
      });

    checkTemplate(obj, template, parentKey);

    if (errors.length) {
      const errorMessage = errors.join(', ');
      errors = [];
      throw errorMessage;
    }

    errors = [];
  };
  return checkObjectStructure;
};
