// @flow
import React from 'react';

import { getBorrowerSimpleArray } from 'core/arrays/BorrowerFormArray';
import AutoForm from 'core/components/AutoForm';
import BorrowerRemover from 'core/components/BorrowerRemover';
import withTranslationContext from 'imports/core/components/Translation/withTranslationContext';

const TranslatedAutoForm = withTranslationContext(({ doc }) => ({
  gender: doc.gender,
}))(AutoForm);

type BorrowerFormProps = {};

const BorrowerForm = ({
  borrowers,
  borrowerId,
  userFormsEnabled,
  loanId,
}: BorrowerFormProps) => {
  const borrower = borrowers.find(({ _id }) => _id === borrowerId);

  return (
    <div className="borrower-form">
      {borrowers.length === 2 && (
        <BorrowerRemover borrower={borrower} loanId={loanId} />
      )}
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
    </div>
  );
};
export default BorrowerForm;
