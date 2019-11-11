import { Migrations } from 'meteor/percolate:migrations';

import { Meteor } from 'meteor/meteor';
import { STEPS } from 'core/api/loans/loanConstants';
import { Loans } from '../..';

const mapStepUp = step => {
  switch (step) {
    case 'PREPARATION':
      return STEPS.SOLVENCY;
    case 'FIND_LENDER':
      return STEPS.REQUEST;
    case 'GET_CONTRACT':
      return STEPS.OFFERS;
    case 'CLOSING':
      return STEPS.CLOSING;
    default:
      throw new Meteor.Error(`Unknown step ${step}`);
  }
};

const mapStepDown = step => {
  switch (step) {
    case STEPS.SOLVENCY:
      return 'PREPARATION';
    case STEPS.REQUEST:
      return 'FIND_LENDER';
    case STEPS.OFFERS:
      return 'GET_CONTRACT';
    case STEPS.CLOSING:
      return 'CLOSING';
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
  version: 9,
  name: 'Rename steps',
  up,
  down,
});
