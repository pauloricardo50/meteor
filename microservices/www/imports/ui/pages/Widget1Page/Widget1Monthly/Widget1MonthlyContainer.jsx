import { connect } from 'react-redux';

import {
  getLoanValue,
  getSimpleYearlyInterests,
  getYearlyAmortization,
  getSimpleYearlyMaintenance,
} from 'core/utils/finance';

export default connect(({
  widget1: {
    fortune: { value: fortune },
    property: { value: propertyValue },
    interestRate,
  },
}) => {
  const loanValue = getLoanValue(propertyValue, fortune);
  const yearlyValues = {
    interests: getSimpleYearlyInterests(loanValue, interestRate),
    amortization: getYearlyAmortization({
      propertyValue,
      loanValue,
    }),
    maintenance: getSimpleYearlyMaintenance(propertyValue),
  };

  const data = Object.keys(yearlyValues).map(valueName => ({
    value: Math.round(yearlyValues[valueName] / 12),
    id: valueName,
  }));

  return { data, total: data.reduce((acc, val) => acc + val.value, 0) };
});
