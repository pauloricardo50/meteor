import React from 'react';
import cx from 'classnames';

import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import AutoForm from 'core/components/AutoForm';
import BorrowerRemover from 'core/components/BorrowerRemover';
import MortgageNotesForm from 'core/components/MortgageNotesForm';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import VerticalAligner from 'core/components/VerticalAligner';

import BorrowersTabFormRecap from './BorrowersTabFormRecap';

const TranslatedAutoForm = withTranslationContext(({ doc }) => ({
  gender: doc.gender,
}))(AutoForm);

const BorrowersTabForm = ({
  borrower,
  index,
  borrowers,
  Calculator,
  funcs,
  loanId,
}) => {
  const { mortgageNotes } = borrower;
  const inputs = funcs.reduce(
    (arr, func) => [
      ...arr,
      ...func({ borrowers, borrowerId: borrower._id, borrower }),
    ],
    [],
  );

  return (
    <div style={{ position: 'relative' }}>
      <h2 className="text-center">
        {borrower.name || `Emprunteur ${index + 1}`}
      </h2>
      <div className="flex c space-children">
        {borrowers && borrowers.length > 1 && (
          <BorrowerRemover
            borrower={borrower}
            loanId={loanId}
            buttonProps={{ outlined: false, size: 'small' }}
          />
        )}
      </div>

      <hr style={{ width: '60%' }} />

      <VerticalAligner id="borrower-finance" defaultMargin={16} nb={index}>
        <TranslatedAutoForm
          formClasses={cx('borrower-forms-form user-form', {
            second: index === 1,
          })}
          inputs={inputs}
          borrowers={borrowers}
          docId={borrower._id}
          collection={BORROWERS_COLLECTION}
          doc={borrower}
          showDisclaimer={false}
        />

        <MortgageNotesForm
          borrowerId={borrower._id}
          mortgageNotes={mortgageNotes}
        />
      </VerticalAligner>

      <BorrowersTabFormRecap
        borrower={borrower}
        Calculator={Calculator}
        index={index}
      />
    </div>
  );
};

export default BorrowersTabForm;
