import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const revenueInsert = new Method({
  name: 'revenueInsert',
  params: {
    revenue: Object,
    loanId: Match.Maybe(String),
  },
});

export const revenueRemove = new Method({
  name: 'revenueRemove',
  params: {
    revenueId: String,
  },
});

export const revenueUpdate = new Method({
  name: 'revenueUpdate',
  params: {
    revenueId: String,
    object: Object,
  },
});
