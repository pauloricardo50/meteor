import React from 'react';

import {
  APPLICATION_TYPES,
  LOANS_COLLECTION,
} from 'core/api/loans/loanConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import {
  getPropertyArray,
  getPropertyLoanArray,
} from 'core/arrays/PropertyFormArray';
import getRefinancingFormArray from 'core/arrays/RefinancingFormArray';
import AutoForm from 'core/components/AutoForm';
import MortgageNotesForm from 'core/components/MortgageNotesForm';

import DeactivatedFormInfo from '../../components/DeactivatedFormInfo';

const SinglePropertyPageForms = ({ loan, borrowers, property }) => {
  const { userFormsEnabled, applicationType } = loan;
  const { mortgageNotes, _id: propertyId } = property;

  return (
    <>
      <DeactivatedFormInfo loan={loan} style={{ margin: '16px 0' }} />

      <div className="flex--helper flex-justify--center">
        <AutoForm
          formClasses="user-form user-form__info"
          inputs={getPropertyLoanArray({ loan, borrowers })}
          collection={LOANS_COLLECTION}
          doc={loan}
          docId={loan._id}
          disabled={!userFormsEnabled}
          showDisclaimer={false}
        />
      </div>

      {applicationType === APPLICATION_TYPES.SIMPLE && (
        <div className="flex--helper flex-justify--center">
          <AutoForm
            formClasses="user-form user-form__info"
            inputs={[
              {
                type: 'h3',
                id: 'previousLoan',
                ignore: true,
                required: false,
              },
              ...getRefinancingFormArray({ loan }),
            ]}
            collection={LOANS_COLLECTION}
            doc={loan}
            docId={loan._id}
            disabled={!userFormsEnabled}
            showDisclaimer={false}
          />
        </div>
      )}

      <div className="flex--helper flex-justify--center">
        <AutoForm
          formClasses="user-form user-form__info"
          inputs={getPropertyArray({ loan, property })}
          collection={PROPERTIES_COLLECTION}
          doc={property}
          docId={property._id}
          disabled={!userFormsEnabled}
        />
      </div>
      <div className="flex--helper flex-justify--center">
        <MortgageNotesForm
          propertyId={propertyId}
          mortgageNotes={mortgageNotes}
        />
      </div>
    </>
  );
};

export default SinglePropertyPageForms;
