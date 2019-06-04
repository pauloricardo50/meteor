import { Match } from 'meteor/check';
import mergeDeep from 'meteor/cultofcoders:grapher/lib/namedQuery/expose/lib/mergeDeep';

import { Meteor } from 'meteor/meteor';
import Security from '../security';

const defaultParams = (options) => {
  const { allowFilterById = false } = options;
  return {
    $body: Match.Maybe(Object),
    limit: Match.Maybe(Number),
    skip: Match.Maybe(Number),
    $sort: Match.Maybe(Object),
    $skip: Match.Maybe(Number),
    $limit: Match.Maybe(Number),
    _userId: Match.Maybe(Match.OneOf(String, null)),
    ...(allowFilterById ? { _id: Match.Maybe(String) } : {}),
  };
};

const defaultFilter = options => ({ filters, params: { _id } }) => {
  const { allowFilterById = false } = options;
  if (allowFilterById && _id) {
    filters._id = _id;
  }
};

const getValidateParams = ({ validateParams = {} } = {}, options) => ({
  ...defaultParams(options),
  ...validateParams,
});

const addSort = (body, params) => {
  const { $sort } = params;
  body.$options = {
    ...body.$options,
    ...($sort !== undefined ? { sort: $sort } : {}),
  };
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
      limit: limit ? Math.min($limit, limit) : $limit,
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

const mergeBody = (body, embody, options) => {
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
    const { allowFilterById = false } = options;

    if (bodyFilter) {
      bodyFilter(...args);
    }
    if (overrideFilter) {
      overrideFilter(...args);
    }

    defaultFilter(options)(...args);
  };
};

const getEmbody = (overrides, options) =>
  function customEmbody(body, params) {
    if (overrides.embody) {
      mergeBody(body, overrides.embody, options);

      if (typeof overrides.embody === 'function') {
        overrides.embody(body, params);
      }
    }

    addOptions(body, params);
  };

const getFirewall = (overrides, options) => (userId, params) => {
  params._userId = userId;
  if (!overrides.firewall) {
    Security.checkUserIsAdmin(userId);
  } else {
    overrides.firewall(userId, params);
  }
};

export const exposeQuery = (query, overrides = {}, options = {}) => {
  query.expose({
    ...overrides,
    firewall: getFirewall(overrides, options),
    embody: getEmbody(overrides, options),
    validateParams: getValidateParams(overrides, options),
  });
};
