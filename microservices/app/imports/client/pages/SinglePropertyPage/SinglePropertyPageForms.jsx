// @flow
import React from 'react';

import AutoForm from 'core/components/AutoForm';
import MortgageNotesForm from 'core/components/MortgageNotesForm';
import {
  getPropertyArray,
  getPropertyLoanArray,
} from 'core/arrays/PropertyFormArray';
import { LOANS_COLLECTION, PROPERTIES_COLLECTION } from 'core/api/constants';
import DeactivatedFormInfo from '../../components/DeactivatedFormInfo';

type SinglePropertyPageFormsProps = {};

const SinglePropertyPageForms = ({
  loan,
  borrowers,
  property,
}: SinglePropertyPageFormsProps) => {
  const { userFormsEnabled } = loan;
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

      <div className="flex--helper flex-justify--center">
        <AutoForm
          formClasses="user-form user-form__info"
          inputs={getPropertyArray({ loan, borrowers, property })}
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
