import React from 'react';
import cx from 'classnames';

import VerticalAligner from 'core/components/VerticalAligner';
import AutoForm from 'core/components/AutoForm';
import { BORROWERS_COLLECTION } from 'core/api/constants';
import {
  getBorrowerFinanceArray,
  getBorrowerInfoArray,
} from 'core/arrays/BorrowerFormArray';
import Recap from 'core/components/Recap';

const BorrowersTabForm = ({
  borrower,
  index,
  borrowers,
  formFilter,
  Calculator,
}) => {
  const inputs = getBorrowerFinanceArray({
    borrowers,
    borrowerId: borrower._id,
  });

  return (
    <div style={{ position: 'relative' }}>
      <h2 className="text-center">{borrower.name}</h2>

      <hr style={{ width: '60%' }} />

      <VerticalAligner id="borrower-finance" defaultMargin={16} nb={index}>
        <AutoForm
          formClasses="borrower-forms-form user-form"
          inputs={inputs}
          borrowers={borrowers}
          docId={borrower._id}
          collection={BORROWERS_COLLECTION}
          doc={borrower}
        />
      </VerticalAligner>

      <div className={cx('side-recap', { right: index === 1 })}>
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
