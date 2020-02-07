import get from 'lodash/get';
import set from 'lodash/set';

import {
  LOANS_COLLECTION,
  REVENUES_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
  ACTIVITIES_COLLECTION,
  TASKS_COLLECTION,
} from 'core/api/constants';
import analysisConfig from './analysisConfig';

export const analysisCollections = Object.keys(analysisConfig);

export const createBodyFromMap = map => {
  const body = {};

  Object.keys(map).forEach(path => {
    const config = map[path];
    let fragment = 1;

    if (config.fragment) {
      fragment = config.fragment;
    } else if (Array.isArray(config) && config[0].fragment) {
      fragment = config[0].fragment;
    }

    if (
      Array.isArray(config) &&
      config.slice(1).some(({ fragment: f }) => !!f)
    ) {
      throw new Error('Can only have one fragment in array description');
    }

    set(body, path, fragment);
  });

  return body;
};

const applyTransformToData = ({
  transform,
  obj,
  newObj,
  key,
  formatMessage,
}) => {
  const { id: translationId, label, format } = transform;
  const translatedKey = label || formatMessage({ id: translationId });
  const rawValue = get(obj, key);

  if (format) {
    newObj[translatedKey] = format(obj);
  } else {
    newObj[translatedKey] = rawValue;
  }
};

export const mapData = ({
  data,
  collection,
  formatMessage,
  map = analysisConfig[collection],
}) =>
  data.map(obj => {
    const newObj = {};

    Object.keys(map).forEach(key => {
      const transforms = map[key];

      if (Array.isArray(transforms)) {
        transforms.forEach(transform => {
          applyTransformToData({
            transform,
            obj,
            newObj,
            key,
            formatMessage,
          });
        });
      } else {
        applyTransformToData({
          transform: transforms,
          obj,
          newObj,
          key,
          formatMessage,
        });
      }
    });

    return newObj;
  });

export const analysisBodies = {
  [LOANS_COLLECTION]: createBodyFromMap(analysisConfig[LOANS_COLLECTION]),
  [REVENUES_COLLECTION]: createBodyFromMap(analysisConfig[REVENUES_COLLECTION]),
  [USERS_COLLECTION]: createBodyFromMap(analysisConfig[USERS_COLLECTION]),
  [BORROWERS_COLLECTION]: createBodyFromMap(
    analysisConfig[BORROWERS_COLLECTION],
  ),
  [ACTIVITIES_COLLECTION]: createBodyFromMap(
    analysisConfig[ACTIVITIES_COLLECTION],
  ),
  [TASKS_COLLECTION]: {
    ...createBodyFromMap(analysisConfig[TASKS_COLLECTION]),
    // $options: { limit: 10 },
  },
};

// FIXME: Not working yet, bug in react-pivottable
// If you assign this function's return value to the PivotTableUI component
// it takes them into account in reverse..?
// i.e. { Anonyme: { false: true } } appears as
// { Anonyme: { true: true } }
export const getDefaultSettingsForCollection = ({
  collection,
  formatMessage,
}) => {
  if (!collection) {
    return;
  }

  const map = analysisConfig[collection];

  const defaultFilters = Object.values(map)
    .filter(config => !!config.defaultValue)
    .reduce(
      (obj, { label, id, defaultValue }) => ({
        ...obj,
        [label || formatMessage({ id })]: defaultValue,
      }),
      {},
    );

  if (Object.keys(defaultFilters).length === 0) {
    return;
  }

  return defaultFilters;
};
