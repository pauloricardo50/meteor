import { connect } from 'react-redux';

import {
  getLoanValue,
  getSimpleYearlyInterests,
  getYearlyAmortization,
  getSimpleYearlyMaintenance,
} from 'core/utils/finance';

const mapStateToProps = ({
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

  // total can be NaN, set it to 0 in that case
  const total = data.reduce((acc, val) => acc + val.value, 0) || 0;

  return { data, total, interestRate };
};

const mapDispatchToProps = dispatch => ({
  setInterestRate: value => dispatch({ type: 'interestRate_SET', value }),
});

export default connect(mapStateToProps, mapDispatchToProps);
