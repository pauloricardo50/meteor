export const testErrors = {
  missingKey: (key, parentKey) => `Missing key ${key} from object ${parentKey}`,
  shouldBeArray: key => `Object key ${key} must be an array.`,
  shouldBeObject: key => `Object key ${key} must be an object.`,
  emptyArray: (key, parentKey) =>
    `Array at object key ${key} in ${parentKey} should not be empty`,
};

export const makeCheckObjectStructure = (errors) => {
  const checkObjectStructure = ({ obj, template, parentKey }) =>
    Object.keys(template).forEach((key) => {
      if (obj[key] === undefined) {
        throw errors.missingKey(key, parentKey || '');
      }

      if (Array.isArray(template[key])) {
        if (!Array.isArray(obj[key])) {
          throw errors.shouldBeArray(key);
        }
        if (template[key].length > 0 && obj[key].length === 0) {
          throw errors.emptyArray(key, parentKey);
        }

        if (
          template[key].length > 0
          && typeof template[key][0] === 'object'
          && !Array.isArray(template[key][0])
        ) {
          obj[key].forEach(object =>
            checkObjectStructure({ obj: object, template: template[key][0] }));
        }
      } else if (typeof template[key] === 'object') {
        if (typeof obj[key] !== 'object' || Array.isArray(obj[key])) {
          throw errors.shouldBeObject(key);
        }
        checkObjectStructure({
          obj: obj[key],
          template: template[key],
          parentKey: key,
        });
      }
    });
  return checkObjectStructure;
};
