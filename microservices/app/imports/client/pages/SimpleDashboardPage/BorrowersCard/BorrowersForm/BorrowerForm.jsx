// @flow
import React from 'react';

import { getBorrowerSimpleArray } from 'core/arrays/BorrowerFormArray';
import AutoForm from 'core/components/AutoForm';
import BorrowerRemover from 'core/components/BorrowerRemover';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

const TranslatedAutoForm = withTranslationContext(({ doc }) => ({
  gender: doc.gender,
}))(AutoForm);

type BorrowerFormProps = {};

const BorrowerForm = ({
  borrowerId,
  userFormsEnabled,
  loan,
  overrides = {},
}: BorrowerFormProps) => {
  const { _id: loanId, borrowers } = loan;
  const borrower = borrowers.find(({ _id }) => _id === borrowerId);
  const { simpleBorrowersForm: simple = true } = loan;

  return (
    <div className="borrower-form animated fadeIn">
      {borrowers.length === 2 && (
        <BorrowerRemover borrower={borrower} loanId={loanId} />
      )}
      <TranslatedAutoForm
        inputs={getBorrowerSimpleArray({
          borrowers,
          borrowerId,
          loan,
        })}
        formClasses="user-form user-form__info"
        docId={borrowerId}
        collection="borrowers"
        doc={
          simple
            ? {
              ...borrower,
              bankFortuneSimple:
                (borrower.bankFortune &&
                  !!borrower.bankFortune.length &&
                  borrower.bankFortune[0].value) ||
                undefined,
              insurance2Simple:
                (borrower.insurance2 &&
                  !!borrower.insurance2.length &&
                  borrower.insurance2[0].value) ||
                undefined,
              bank3ASimple:
                (borrower.bank3A &&
                  !!borrower.bank3A.length &&
                  borrower.bank3A[0].value) ||
                undefined,
              insurance3ASimple:
                (borrower.insurance3A &&
                  !!borrower.insurance3A.length &&
                  borrower.insurance3A[0].value) ||
                undefined,
              insurance3BSimple:
                (borrower.insurance3B &&
                  !!borrower.insurance3B.length &&
                  borrower.insurance3B[0].value) ||
                undefined,
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
