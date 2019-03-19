// @flow
import React from 'react';

import { PROPERTY_CATEGORY } from '../../api/constants';
import Calculator from '../../utils/Calculator';
import LoanChecklistFields from './LoanChecklistFields';
import LoanChecklistDocuments from './LoanChecklistDocuments';

type LoanChecklistProps = {};

const LoanChecklist = ({ loan }: LoanChecklistProps) => {
  const property = Calculator.selectProperty({ loan });
  const displayPropertyChecklist = !loan.hasPromotion
    && property
    && property._id // Perform extra check in case property is an empty object
    && property.category !== PROPERTY_CATEGORY.PRO;

  return (
    <div className="loan-checklist">
      <LoanChecklistFields
        loan={loan}
        displayPropertyChecklist={displayPropertyChecklist}
      />
      <LoanChecklistDocuments
        loan={loan}
        displayPropertyChecklist={displayPropertyChecklist}
      />
    </div>
  );
};

export default LoanChecklist;
