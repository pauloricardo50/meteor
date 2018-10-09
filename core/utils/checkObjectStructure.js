export const checkObjectStructure = ({ obj, template }) =>
  Object.keys(template).forEach((key) => {
    if (obj[key] === undefined) {
      throw `Missing key ${key} from object.`;
    }

    if (Array.isArray(template[key])) {
      if (!Array.isArray(obj[key])) {
        throw `Object key ${key} must be an array.`;
      }
      if (template[key].length > 0 && obj[key].length === 0) {
        throw `Array at object key ${key} should not be empty.`;
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
        throw `Object key ${key} must be an object.`;
      }
      checkObjectStructure({ obj: obj[key], template: template[key] });
    }
  });
