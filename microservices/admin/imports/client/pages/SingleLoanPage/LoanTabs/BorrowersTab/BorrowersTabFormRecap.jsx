import React from 'react';
import cx from 'classnames';

import Recap from 'core/components/Recap';
import useElementSize from 'core/hooks/useElementSize';
import BorrowerAge from '../BorrowerAge';

const BorrowersTabFormRecap = ({ borrower, Calculator, index }) => {
  const { top: recapHeight } = useElementSize(() => {
    const els = document.getElementsByClassName('borrower-forms');
    return els && els[0];
  });

  if (!recapHeight) {
    return null;
  }

  return (
    <div
      className={cx('side-recap card1 shadow-2 card-top', {
        right: index === 1,
      })}
      style={{ top: recapHeight + window.scrollY + 80 }}
    >
      <div className="flex-col center-align">
        <BorrowerAge borrower={borrower} />
      </div>
      <Recap arrayName="borrower" borrower={borrower} Calculator={Calculator} />
    </div>
  );
};

export default BorrowersTabFormRecap;
