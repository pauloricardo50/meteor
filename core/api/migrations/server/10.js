import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';

import { STEPS } from 'core/api/loans/loanConstants';

import Loans from '../../loans/loans';

const mapStepUp = step => {
  switch (step) {
    case STEPS.SOLVENCY:
      return STEPS.REQUEST;
    case STEPS.REQUEST:
      return STEPS.OFFERS;
    case STEPS.OFFERS:
      return STEPS.OFFERS;
    case STEPS.CLOSING:
      return STEPS.CLOSING;
    default:
      throw new Meteor.Error(`Unknown step ${step}`);
  }
};

const mapStepDown = step => {
  switch (step) {
    case STEPS.SOLVENCY:
      return STEPS.SOLVENCY;
    case STEPS.REQUEST:
      return STEPS.REQUEST;
    case STEPS.OFFERS:
      return STEPS.OFFERS;
    case STEPS.CLOSING:
      return STEPS.CLOSING;
    default:
      throw new Meteor.Error(`Unknown step ${step}`);
  }
};

export const up = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(({ _id, step }) =>
      Loans.rawCollection().update(
        { _id },
        { $set: { step: mapStepUp(step) } },
      ),
    ),
  );
};

export const down = () => {
  const allLoans = Loans.find({}).fetch();

  return Promise.all(
    allLoans.map(({ _id, step }) =>
      Loans.rawCollection().update(
        { _id },
        { $set: { step: mapStepDown(step) } },
      ),
    ),
  );
};

Migrations.add({
  version: 10,
  name: 'Correct step for current loans',
  up,
  down,
});
