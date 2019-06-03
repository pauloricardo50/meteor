import { Match } from 'meteor/check';
import mergeDeep from 'meteor/cultofcoders:grapher/lib/namedQuery/expose/lib/mergeDeep';

import { Meteor } from 'meteor/meteor';
import Security from '../security';

const defaultParams = {
  $body: Match.Maybe(Object),
  limit: Match.Maybe(Number),
  skip: Match.Maybe(Number),
  $sort: Match.Maybe(Object),
  $skip: Match.Maybe(Number),
  $limit: Match.Maybe(Number),
};

const defaultFilter = ({ filters, params: { _id } }) => {
  if (_id) {
    filters._id = _id;
  }
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
    ? { ...defaultQueryBody.validateParams, ...overrides.validateParams }
    : defaultQueryBody.validateParams);

const addSort = (body, params) => {
  const { $sort } = params;
  if ($sort) {
    body.$options = { ...body.$options, sort: $sort };
  } else if ($sort === null) {
    body.$options = { ...body.$options, sort: null };
  }
};

const addSkip = (body, params) => {
  const { $skip } = params;
  if ($skip) {
    body.$options = { ...body.$options, skip: $skip };
  }
};

const addLimit = (body, params) => {
  const { $limit } = params;
  if ($limit) {
    const { $options: { limit } = {} } = body;
    body.$options = {
      ...body.$options,
      limit: limit ? Math.min($limit, limit) : limit,
    };
  }
};

const addPaginate = (body) => {
  body.$paginate = true;
};

const addOptions = (body, params) => {
  addSort(body, params);
  addSkip(body, params);
  addLimit(body, params);
  addPaginate(body);
};

const mergeBody = (body, embody) => {
  if (typeof embody === 'function') {
    return;
  }

  if (embody === null) {
    throw new Meteor.Error('Embody cannot be null');
  }

  const { $filter: bodyFilter } = body;
  const { $filter: overrideFilter, $filters } = embody;

  if ($filters) {
    throw new Meteor.Error('Do not use $filters in a embody object. Use $filter instead, or use a embody function.');
  }

  mergeDeep(body, embody);

  body.$filter = (...args) => {
    if (bodyFilter && overrideFilter) {
      bodyFilter(...args);
      overrideFilter(...args);
    }
    defaultFilter(...args);
  };
};

const getEmbody = overrides =>
  function customEmbody(body, params) {
    if (overrides.embody) {
      mergeBody(body, overrides.embody);

      if (typeof overrides.embody === 'function') {
        overrides.embody(body, params);
      }
    }

    addOptions(body, params);
  };

export const exposeQuery = (query, overrides = {}) => {
  query.expose({
    ...defaultQueryBody,
    ...overrides,
    embody: getEmbody(overrides),
    validateParams: getValidateParams(overrides),
  });
};
