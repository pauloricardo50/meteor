import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { currentInterestRates } from 'core/api/interestRates/queries';
import {
  getLoanValue,
  getSimpleYearlyInterests,
  getYearlyAmortization,
  getSimpleYearlyMaintenance,
} from '../widget1Math';
import { widget1Constants } from '../../../redux/widget1';
import { commonTypes } from '../../../redux/common';

const mapStateToProps = ({
  widget1: {
    fortune: { value: fortune },
    property: { value: propertyValue },
    wantedLoan: { value: wantedLoan },
    interestRate,
    useMaintenance,
    purchaseType,
  },
}) => {
  const loanValue =
    purchaseType === widget1Constants.PURCHASE_TYPE.ACQUISITION
      ? getLoanValue(propertyValue, fortune)
      : wantedLoan;
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
    dispatch({ type: commonTypes.SET_VALUE('interestRate'), value }),
  setMaintenance: value =>
    dispatch({ type: commonTypes.SET_VALUE('useMaintenance'), value }),
});

export default compose(
  withSmartQuery({
    query: currentInterestRates,
    dataName: 'currentInterestRates',
    smallLoader: true,
  }),
  connect(mapStateToProps, mapDispatchToProps),
);
