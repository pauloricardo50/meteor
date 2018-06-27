import { connect } from 'react-redux';

import { getLoanValue } from 'core/utils/finance';
import { NOTARY_FEES } from 'core/config/financeConstants';
import { toMoney } from 'core/utils/conversionFunctions';
import {
  widget1Constants,
  widget1Selectors,
  Widget1Suggester,
} from '../../../../redux/widget1';

const getAcquisitionArray = (state) => {
  const propertyValue = widget1Selectors.makeSelectValue('property')(state);
  const fortune = widget1Selectors.makeSelectValue('fortune')(state);
  const loanValue = getLoanValue(propertyValue, fortune);

  return [
    { label: 'Recap.project', title: true },
    { label: 'Recap.purchasePrice', value: propertyValue },
    { label: 'general.notaryFees', value: propertyValue * NOTARY_FEES },
    {
      label: 'Recap.totalCost',
      value: propertyValue * (1 + NOTARY_FEES),
      spacing: true,
      bold: true,
    },
    { label: 'Recap.financing', title: true },
    { label: 'general.ownFunds', value: fortune },
    { label: 'general.mortgageLoan', value: loanValue },
    { label: 'Recap.totalFinancing', value: loanValue + fortune, bold: true },
  ];
};

const getRefinancingArray = (state) => {
  const propertyValue = widget1Selectors.makeSelectValue('property')(state);
  const currentLoan = widget1Selectors.makeSelectValue('currentLoan')(state);
  const wantedLoan = widget1Selectors.makeSelectValue('wantedLoan')(state);
  const salary = widget1Selectors.makeSelectValue('salary')(state);
  const loanChange = wantedLoan - currentLoan;
  const maxPossibleLoan = Widget1Suggester.getMaxPossibleLoan({
    property: propertyValue,
    salary,
  });

  return [
    { label: 'Recap.maxPossibleLoan', value: maxPossibleLoan },
    { label: 'Recap.project', title: true },
    { label: 'Recap.propertyValue', value: propertyValue },
    { label: 'Widget1SingleInput.currentLoan', value: currentLoan },
    { space: true },
    {
      label: loanChange > 0 ? 'Recap.loanIncrease' : 'Recap.loanReduction',
      value: loanChange,
    },
  ];
};

const cleanUpArray = (array, showValues) =>
  array.map(item => ({
    ...item,
    value: showValues ? toMoney(item.value) : '-',
  }));

const getArray = (state) => {
  const propertyValue = widget1Selectors.makeSelectValue('property')(state);
  const fortune = widget1Selectors.makeSelectValue('fortune')(state);
  const purchaseType = widget1Selectors.makeWidget1Selector('purchaseType')(state);
  const currentLoan = widget1Selectors.makeSelectValue('currentLoan')(state);
  const wantedLoan = widget1Selectors.makeSelectValue('wantedLoan')(state);
  const showValues =
    purchaseType === widget1Constants.PURCHASE_TYPE.ACQUISITION
      ? propertyValue && fortune
      : propertyValue && currentLoan && wantedLoan;

  const array = (purchaseType === widget1Constants.PURCHASE_TYPE.ACQUISITION
    ? getAcquisitionArray
    : getRefinancingArray)(state);

  return cleanUpArray(array, showValues);
};

const mapStateToProps = state => ({ array: getArray(state) });

export default connect(mapStateToProps);
