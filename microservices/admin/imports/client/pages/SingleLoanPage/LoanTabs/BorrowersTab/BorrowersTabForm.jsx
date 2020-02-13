import React from 'react';
import cx from 'classnames';

import VerticalAligner from 'core/components/VerticalAligner';
import AutoForm from 'core/components/AutoForm';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import withTranslationContext from 'core/components/Translation/withTranslationContext';

import Recap from 'core/components/Recap';

const TranslatedAutoForm = withTranslationContext(({ doc }) => ({
  gender: doc.gender,
}))(AutoForm);

const BorrowersTabForm = ({
  borrower,
  index,
  borrowers,
  Calculator,
  funcs,
}) => {
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
      </VerticalAligner>

      <div className={cx('side-recap card1 card-top', { right: index === 1 })}>
        <Recap
          arrayName="borrower"
          borrower={borrower}
          Calculator={Calculator}
        />
      </div>
    </div>
  );
};

export default BorrowersTabForm;
