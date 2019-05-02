import { Match } from 'meteor/check';

import Security from '../security';

const defaultParams = {
  $body: Match.Maybe(Object),
  limit: Match.Maybe(Number),
  skip: Match.Maybe(Number),
};

const defaultEmbody = {
  $filter({ filters, params: { _id } }) {
    if (_id) {
      filters._id = _id;
    }
  },
};

export const defaultQueryBody = {
  firewall(userId, params) {
    Security.checkUserIsAdmin(userId);
  },
  validateParams: {
    _id: Match.Maybe(String),
    ...defaultParams,
  },
};

const getValidateParams = overrides =>
  (overrides.validateParams
    ? { ...defaultParams, ...overrides.validateParams }
    : defaultQueryBody.validateParams);

const getEmbody = overrides => ({
  $paginate: true,
  ...defaultEmbody,
  ...overrides.embody,
});

export const exposeQuery = (query, overrides = {}) => {
  query.expose({
    ...defaultQueryBody,
    ...overrides,
    embody: getEmbody(overrides),
    validateParams: getValidateParams(overrides),
  });
};
