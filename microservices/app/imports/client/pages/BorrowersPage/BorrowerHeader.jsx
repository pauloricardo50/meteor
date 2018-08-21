import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/pro-light-svg-icons';

import T from 'core/components/Translation';
import BorrowerAdder from '../../components/BorrowerAdder';
import Progress from './Progress';

const BorrowerHeader = ({ tabId, loan: { _id: loanId, borrowers } }) => (
  <header className="borrower-header borrower-header--fixed p-d--16">
    <div className="borrower-header__row flex p-d--16">
      {borrowers.map((borrower, borrowerIndex) => (
        <div
          className="col--50 flex-col borrower-header__info flex--helper"
          key={borrower._id}
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
                    <T
                        id="BorrowerHeader.title"
                      values={{ index: borrowerIndex + 1 }}
                    />
                    </div>
                  )}
                </span>
                <span>
                  {borrower.firstName && borrower.lastName
                    ? borrower.lastName
                    : null}
                </span>
              </h1>
            </div>
          </div>
          <Progress borrower={borrower} tabId={tabId} />
        </div>
      ))}
      {borrowers.length === 1 && (
        <div className="borrower-adder col--50">
          <BorrowerAdder loanId={loanId} />
        </div>
      )}
    </div>
  </header>
);

BorrowerHeader.propTypes = {
  loan: PropTypes.object.isRequired,
  tabId: PropTypes.string.isRequired,
};

export default BorrowerHeader;
