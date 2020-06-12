import { Meteor } from 'meteor/meteor';

import React from 'react';

import { PURCHASE_TYPE } from '../../../../api/loans/loanConstants';
import Calculator from '../../../../utils/Calculator';
import T from '../../../Translation';
import FinancingSection, {
  CalculatedValue,
  FinancingDateField,
  FinancingField,
} from '../FinancingSection';
import FinancingProjectFees from './FinancingProjectFees';
import FinancingPropertyPicker from './FinancingPropertyPicker';

const MAX_NOTARY_FEES_RATE = 0.1;

const calculateDefaultNotaryFees = data => Calculator.getNotaryFees(data).total;

const calculateMaxNotaryFees = data =>
  (Calculator.selectPropertyValue(data) + data.structure.propertyWork) *
  MAX_NOTARY_FEES_RATE;

const isAdmin = Meteor.microservice === 'admin';

const oneStructureHasBankValue = ({ loan }) => {
  const { structures = [] } = loan;
  return structures.some(
    ({ id }) =>
      Calculator.selectPropertyKey({
        loan,
        structureId: id,
        key: 'bankValue',
      }) > 0,
  );
};

const FinancingProject = ({ purchaseType }) => {
  const isRefinancing = purchaseType === PURCHASE_TYPE.REFINANCING;

  return (
    <FinancingSection
      summaryConfig={[
        {
          id: 'project',
          label: (
            <span className="section-title">
              {isRefinancing ? (
                <T id="FinancingProject.refinancing.title" />
              ) : (
                <T id="FinancingProject.title" />
              )}
            </span>
          ),
          Component: CalculatedValue,
          value: isRefinancing
            ? Calculator.selectPropertyValue
            : Calculator.getProjectValue,
        },
      ]}
      detailConfig={[
        {
          Component: FinancingPropertyPicker,
          id: 'propertyId',
        },
        {
          Component: FinancingField,
          id: 'propertyValue',
          calculatePlaceholder: data => Calculator.selectPropertyValue(data),
          max: 100000000,
          allowUndefined: true,
          forceUndefined: true,
        },
        {
          id: 'bankValue',
          Component: CalculatedValue,
          value: ({ loan, structureId }) =>
            Calculator.selectPropertyKey({
              loan,
              structureId,
              key: 'bankValue',
            }),
          condition: data => isAdmin && oneStructureHasBankValue(data),
        },
        {
          Component: FinancingField,
          id: 'propertyWork',
          max: 10000000,
          condition: !isRefinancing,
        },
        {
          Component: FinancingProjectFees,
          id: 'notaryFees',
          calculatePlaceholder: calculateDefaultNotaryFees,
          max: calculateMaxNotaryFees,
          allowUndefined: true,
          condition: !isRefinancing,
        },
        {
          id: 'refinancingDate',
          Component: FinancingDateField,
          condition: isRefinancing,
        },
      ]}
    />
  );
};

export default FinancingProject;
