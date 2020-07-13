import React from 'react';

import Recap2 from 'core/components/Recap2';
import T from 'core/components/Translation/FormattedMessage';
import { toMoney } from 'core/utils/conversionFunctions';

import { NOTARY_FEES, PURCHASE_TYPE } from './wwwCalculatorConstants';
import WwwCalculatorFinma from './WwwCalculatorFinma';
import { getLoanValue, getMaxPossibleLoan } from './wwwCalculatorMath';
import { useWwwCalculator } from './WwwCalculatorState';

const getAcquisitionArray = ({ fortune, property }) => {
  const loanValue = getLoanValue(property.value, fortune.value);

  return [
    { label: 'WwwCalculatorRecap.project', title: true },
    { label: 'WwwCalculatorFormField.property', value: property.value },
    {
      label: 'WwwCalculatorRecap.notaryFees',
      value: property.value * NOTARY_FEES,
    },
    {
      label: 'WwwCalculatorRecap.totalCost',
      value: property.value * (1 + NOTARY_FEES),
      spacing: true,
      bold: true,
    },
    { label: 'WwwCalculatorRecap.financing', title: true },
    { label: 'WwwCalculatorRecap.ownFunds', value: fortune.value },
    { label: 'WwwCalculatorRecap.mortgageLoan', value: loanValue },
    {
      label: 'WwwCalculatorRecap.totalFinancing',
      value: loanValue + fortune.value,
      bold: true,
    },
  ];
};

const getRefinancingArray = ({ property, salary, currentLoan, wantedLoan }) => {
  const loanChange = wantedLoan.value - currentLoan.value;
  const maxPossibleLoan = getMaxPossibleLoan(property.value, salary.value);

  return [
    { label: 'WwwCalculatorRecap.maxPossibleLoan', value: maxPossibleLoan },
    { label: 'WwwCalculatorRecap.project', title: true },
    { label: 'WwwCalculatorFormField.property', value: property.value },
    { label: 'WwwCalculatorFormField.currentLoan', value: currentLoan.value },
    { space: true },
    {
      label:
        loanChange > 0
          ? 'WwwCalculatorRecap.loanIncrease'
          : 'WwwCalculatorRecap.loanReduction',
      value: loanChange,
    },
  ];
};

const cleanUpArray = (array, showValues, intlValues) =>
  array.map(item => ({
    ...item,
    value: showValues ? toMoney(item.value) : '-',
    label: <T id={item.label} values={intlValues} />,
  }));

const getArray = state => {
  const { fortune, property, currentLoan, wantedLoan, purchaseType } = state;
  const showValues =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? property.value && fortune.value
      : property.value && currentLoan.value && wantedLoan.value;

  const array = (purchaseType === PURCHASE_TYPE.ACQUISITION
    ? getAcquisitionArray
    : getRefinancingArray)(state);

  return cleanUpArray(array, showValues, { purchaseType });
};

const WwwCalculatorRecap = () => {
  const [state] = useWwwCalculator();
  const array = getArray(state);

  return (
    <div className="www-calculator-recap">
      <h3>
        <T id="WwwCalculatorRecap.title" />
      </h3>

      <div className="flex-col center-align">
        <Recap2 array={array} />
      </div>

      <WwwCalculatorFinma />
    </div>
  );
};

export default WwwCalculatorRecap;
