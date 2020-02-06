//
import React from 'react';

import T from 'core/components/Translation';
import BorrowerReuser from 'core/components/BorrowerReuser';
import BorrowerRemover from 'core/components/BorrowerRemover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons/faUserCircle';
import Progress from './Progress';

const BorrowerHeaderDetails = ({
  borrower,
  index,
  borrowerCount,
  tabId = 'personal',
  loanId,
}) => (
  <div
    className="col--50 flex-col borrower-header__info flex--helper"
    key={borrower._id}
    id={borrower._id}
  >
    <div className="flex--row flex--center flex--helper borrower">
      <FontAwesomeIcon icon={faUserCircle} className="icon" />
      <div className="borrower-header__user flex--helper flex--column">
        <h1 className="no-margin truncate">
          <span>
            {borrower.firstName && borrower.lastName ? (
              borrower.firstName
            ) : (
              <div className="borrower-num">
                <T id="BorrowerHeader.title" values={{ index: index + 1 }} />
              </div>
            )}
          </span>
          <span>
            {borrower.firstName && borrower.lastName ? borrower.lastName : null}
          </span>
        </h1>
      </div>
      {borrowerCount === 2 && (
        <BorrowerRemover borrower={borrower} loanId={loanId} />
      )}
    </div>
    <Progress borrower={borrower} tabId={tabId} />
    {tabId === 'personal' && (
      <BorrowerReuser loanId={loanId} borrowerId={borrower._id} />
    )}
  </div>
);

export default BorrowerHeaderDetails;
