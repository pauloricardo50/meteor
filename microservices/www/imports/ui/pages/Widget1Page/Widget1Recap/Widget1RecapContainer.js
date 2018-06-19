import { connect } from 'react-redux';

import { getLoanValue } from 'core/utils/finance';
import { NOTARY_FEES } from 'core/config/financeConstants';
import { toMoney } from 'core/utils/conversionFunctions';
import { PURCHASE_TYPE } from '../../../../redux/constants/widget1Constants';
import {
  makeSelectValue,
  makeWidget1Selector,
} from '../../../../redux/reducers/widget1';
import Widget1Suggester from '../../../../redux/utils/Widget1Suggester';

const getAcquisitionArray = (state) => {
  const propertyValue = makeSelectValue('property')(state);
  const fortune = makeSelectValue('fortune')(state);
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
  const propertyValue = makeSelectValue('property')(state);
  const currentLoan = makeSelectValue('currentLoan')(state);
  const wantedLoan = makeSelectValue('wantedLoan')(state);
  const salary = makeSelectValue('salary')(state);
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
  const propertyValue = makeSelectValue('property')(state);
  const fortune = makeSelectValue('fortune')(state);
  const purchaseType = makeWidget1Selector('purchaseType')(state);
  const currentLoan = makeSelectValue('currentLoan')(state);
  const wantedLoan = makeSelectValue('wantedLoan')(state);
  const showValues =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? propertyValue && fortune
      : propertyValue && currentLoan && wantedLoan;

  const array = (purchaseType === PURCHASE_TYPE.ACQUISITION
    ? getAcquisitionArray
    : getRefinancingArray)(state);

  return cleanUpArray(array, showValues);
};

const mapStateToProps = state => ({ array: getArray(state) });

export default connect(mapStateToProps);
