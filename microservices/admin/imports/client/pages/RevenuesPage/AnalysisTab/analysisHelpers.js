import get from 'lodash/get';
import set from 'lodash/set';

import {
  LOANS_COLLECTION,
  REVENUES_COLLECTION,
  USERS_COLLECTION,
  LOAN_STATUS_ORDER,
  BORROWERS_COLLECTION,
  REVENUE_STATUS,
} from 'core/api/constants';

export const analysisCollections = [
  LOANS_COLLECTION,
  REVENUES_COLLECTION,
  USERS_COLLECTION,
  BORROWERS_COLLECTION,
];

const formatDate = date =>
  date && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, 0)}`;

const collectionMaps = {
  [LOANS_COLLECTION]: {
    category: { id: 'Forms.category' },
    status: {
      id: 'Forms.status',
      format: status => `${LOAN_STATUS_ORDER.indexOf(status) + 1}. ${status}`,
    },
    residenceType: { id: 'Forms.residenceType' },
    'user.roles': { id: 'Forms.roles' },
    createdAt: [
      {
        label: 'Création Mois-Année',
        format: formatDate,
      },
      {
        label: 'Création Année',
        format: date => date && date.getFullYear(),
      },
    ],
    anonymous: { id: 'Forms.anonymous', defaultValue: { true: true } },
    'user.assignedEmployee.name': { label: 'Conseiller' },
    'structure.wantedLoan': { id: 'Forms.wantedLoan' },
    revenues: [
      {
        id: 'collections.revenues',
        fragment: { amount: 1, status: 1 },
        format: (revenues = []) =>
          revenues.reduce((t, { amount }) => t + amount, 0),
      },
      {
        label: 'Revenus encaissés',
        fragment: { amount: 1, status: 1 },
        format: (revenues = []) =>
          revenues
            .filter(({ status }) => status === REVENUE_STATUS.CLOSED)
            .reduce((t, { amount }) => t + amount, 0),
      },
    ],
  },
  [REVENUES_COLLECTION]: {
    amount: { id: 'Forms.amount' },
    type: { id: 'Forms.type' },
    secondaryType: { id: 'Forms.secondaryType' },
    status: { id: 'Forms.status' },
    'sourceOrganisation.name': { id: 'Forms.sourceOrganisationLink' },
    paidAt: {
      label: 'Payé Mois-Année',
      format: formatDate,
    },
    expectedAt: {
      label: 'Attendu Mois-Année',
      format: formatDate,
    },
    'assignee.name': { label: 'Responsable' },
  },
  [USERS_COLLECTION]: {
    roles: { id: 'Forms.roles' },
    'referredByOrganisation.name': { id: 'Forms.referredBy' },
    createdAt: {
      label: 'Création Mois-Année',
      format: formatDate,
    },
    'assignedEmployee.name': { label: 'Conseiller' },
  },
  [BORROWERS_COLLECTION]: {
    age: { id: 'Forms.age' },
    gender: { id: 'Forms.gender' },
    isSwiss: { id: 'Forms.isSwiss' },
    civilStatus: { id: 'Forms.civilStatus' },
    createdAt: {
      label: 'Création Mois-Année',
      format: formatDate,
    },
    netSalary: { id: 'Forms.netSalary' },
    salary: { id: 'Forms.salary' },
  },
};

const createBodyFromMap = map => {
  const body = {};

  Object.keys(map).forEach(path => {
    const config = map[path];
    let fragment = 1;

    if (config.fragment) {
      fragment = config.fragment;
    } else if (Array.isArray(config) && config[0].fragment) {
      fragment = config[0].fragment;
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
    newObj[translatedKey] = format(rawValue);
  } else {
    newObj[translatedKey] = rawValue;
  }
};

export const mapData = ({ data, collection, formatMessage }) => {
  const map = collectionMaps[collection];

  return data.map(obj => {
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
};

export const analysisBodies = {
  [LOANS_COLLECTION]: {
    ...createBodyFromMap(collectionMaps[LOANS_COLLECTION]),
    // $filters: { status: 'FINALIZED' },
    // $options: { limit: 10 },
  },
  [REVENUES_COLLECTION]: {
    ...createBodyFromMap(collectionMaps[REVENUES_COLLECTION]),
    // $options: { limit: 10 },
  },
  [USERS_COLLECTION]: {
    ...createBodyFromMap(collectionMaps[USERS_COLLECTION]),
    // $options: { limit: 10 },
  },
  [BORROWERS_COLLECTION]: {
    ...createBodyFromMap(collectionMaps[BORROWERS_COLLECTION]),
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

  const map = collectionMaps[collection];

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
