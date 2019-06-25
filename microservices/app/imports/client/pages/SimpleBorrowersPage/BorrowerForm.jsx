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
  borrowerId,
  userFormsEnabled,
  loan,
  overrides = {},
  simple = false,
}: BorrowerFormProps) => {
  const borrower = loan.borrowers.find(({ _id }) => _id === borrowerId);

  return (
    <div className="borrower-form">
      {loan.borrowers.length === 2 && (
        <BorrowerRemover borrower={borrower} loanId={loan._id} />
      )}
      <TranslatedAutoForm
        inputs={getBorrowerSimpleArray({
          borrowers: loan.borrowers,
          borrowerId,
          loan,
          simple,
        })}
        formClasses="user-form user-form__info"
        docId={borrowerId}
        collection="borrowers"
        doc={
          simple
            ? {
              ...borrower,
              insurance2Simple:
                  (borrower.insurance2
                    && !!borrower.insurance2.length
                    && borrower.insurance2[0].value)
                  || undefined,
              bank3ASimple:
                  (borrower.bank3A
                    && !!borrower.bank3A.length
                    && borrower.bank3A[0].value)
                  || undefined,
              insurance3ASimple:
                  (borrower.insurance3A
                    && !!borrower.insurance3A.length
                    && borrower.insurance3A[0].value)
                  || undefined,
              insurance3BSimple:
                  (borrower.insurance3B
                    && !!borrower.insurance3B.length
                    && borrower.insurance3BS[0].value)
                  || undefined,
            }
            : borrower
        }
        disabled={!userFormsEnabled}
        overrides={overrides}
      />
    </div>
  );
};
export default BorrowerForm;
