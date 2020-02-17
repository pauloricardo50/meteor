import React from 'react';
import cx from 'classnames';

import VerticalAligner from 'core/components/VerticalAligner';
import AutoForm from 'core/components/AutoForm';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import withTranslationContext from 'core/components/Translation/withTranslationContext';
import MortgageNotesForm from 'core/components/MortgageNotesForm';
import BorrowerRemover from 'core/components/BorrowerRemover';
import BorrowerReuser from 'core/components/BorrowerReuser';
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
        <BorrowerReuser
          loanId={loanId}
          borrowerId={borrower._id}
          buttonProps={{
            raised: false,
            size: 'small',
            primary: true,
            label: 'Réutiliser emprunteur',
          }}
        />
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
