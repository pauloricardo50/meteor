import { connect } from 'react-redux';

import {
  getLoanValue,
  getSimpleYearlyInterests,
  getYearlyAmortization,
  getSimpleYearlyMaintenance,
} from 'core/utils/finance';
import { setValueAction } from '../../../../redux/reducers/widget1';

const mapStateToProps = ({
  widget1: {
    fortune: { value: fortune },
    property: { value: propertyValue },
    interestRate,
    useMaintenance,
  },
}) => {
  const loanValue = getLoanValue(propertyValue, fortune);
  const yearlyValues = {
    interests: getSimpleYearlyInterests(loanValue, interestRate),
    amortization: getYearlyAmortization({
      propertyValue,
      loanValue,
    }),
    maintenance: useMaintenance ? getSimpleYearlyMaintenance(propertyValue) : 0,
  };

  const data = Object.keys(yearlyValues).map(valueName => ({
    value: Math.round(yearlyValues[valueName] / 12),
    id: valueName,
  }));

  // total can be NaN, set it to 0 in that case
  const total = data.reduce((acc, val) => acc + val.value, 0) || 0;

  return { data, total, interestRate, useMaintenance };
};

const mapDispatchToProps = dispatch => ({
  setInterestRate: value =>
    dispatch({ type: setValueAction('interestRate'), value }),
  setMaintenance: value =>
    dispatch({ type: setValueAction('useMaintenance'), value }),
});

export default connect(mapStateToProps, mapDispatchToProps);
