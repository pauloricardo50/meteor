// @flow
import React from 'react';

import { getBorrowerSimpleArray } from 'core/arrays/BorrowerFormArray';
import AutoForm from 'core/components/AutoForm';
import withTranslationContext from 'imports/core/components/Translation/withTranslationContext';

const TranslatedAutoForm = withTranslationContext(({ doc }) => ({
  gender: doc.gender,
}))(AutoForm);

type BorrowerFormProps = {};

const BorrowerForm = ({
  borrowers,
  borrowerId,
  userFormsEnabled,
}: BorrowerFormProps) => {
  const borrower = borrowers.find(({ _id }) => _id === borrowerId);

  return (
    <TranslatedAutoForm
      inputs={getBorrowerSimpleArray({
        borrowers,
        borrowerId,
      })}
      formClasses="user-form user-form__info"
      docId={borrowerId}
      collection="borrowers"
      doc={borrower}
      disabled={!userFormsEnabled}
    />
  );
};
export default BorrowerForm;
