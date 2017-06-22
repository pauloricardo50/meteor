import React from 'react';
import PropTypes from 'prop-types';

import constants from '/imports/js/config/constants';
import { toMoney } from '/imports/js/helpers/conversionFunctions';

const maxProperty = (
  income,
  fortune,
  insuranceFortune = 0,
  usageType = 'primary',
  toRetirement,
) => {
  let r = toRetirement;
  // Make sure toRetirement is capped between 0 and 15 years
  if (toRetirement < 0) {
    r = 0;
  } else if (toRetirement > 15) {
    r = 15;
  }

  // Fortune should cover 20% and notary fees
  let fortuneLimited = fortune / (1 - constants.maxLoan(usageType, r) + 0.05);
  if (usageType === 'primary') {
    fortuneLimited = calculatePrimaryProperty(fortune, insuranceFortune);
  }

  // The arithmetic relation to have the cost of the loan be at exactly the max ratio of income
  // Derive it like this:
  // maxRatio * salary >= property * maintenance + loan * loanCost
  // loan = (property + notaryFees + lppFees) - totalFortune
  // Extract property from this relation
  const totalFortune = fortune + insuranceFortune;
  const lppFees = insuranceFortune * constants.lppFees;
  const nF = constants.notaryFees;
  const i = constants.interests;
  const mR = constants.maxRatio;
  const m = constants.maintenance;

  // The first one is with 0 amortization
  const incomeLimited1 = (mR * income + (totalFortune - lppFees) * i) / (m + (1 + nF) * i);

  // The second is with amortization factored in (and it could be negative due to math)
  const incomeLimited2 =
    ((1 + r * i) * (totalFortune - lppFees) + mR * r * income) /
    (r * (m + i) + nF * (1 + r * i) + 0.35);

  // Therefore, take the minimum value of both, which is the most limiting one
  // Because of the ratios, round this value down
  const incomeLimited = Math.floor(Math.min(incomeLimited1, incomeLimited2));

  // Use floor to make sure the ratios are respected and avoid edge cases
  return Math.round(Math.min(fortuneLimited, incomeLimited));
};

export const calculatePrimaryProperty = (fortune, insuranceFortune) => {
  if (fortune <= 0 || insuranceFortune < 0) {
    return 0;
  }

  const lppFees = insuranceFortune * constants.lppFees;
  const notaryFees = constants.notaryFees;

  // Make sure cash can pay for lppFees, and fortune can cover notaryfees
  const totalFortuneLimitedValue = (fortune - lppFees + insuranceFortune) / (0.2 + notaryFees);

  // Make sure cash can pay for lppfees and notaryfees
  const cashLimitedValue = (fortune - lppFees) / (0.1 + notaryFees);

  return Math.max(Math.round(Math.min(cashLimitedValue, totalFortuneLimitedValue)), 0);
};

export default class TestPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const val = maxProperty(200000, 500000, 0, 'primary', 15);
    return (
      <div>
        <div><br />CHF {toMoney(val)}</div>
      </div>
    );
  }
}

TestPage.propTypes = {};
