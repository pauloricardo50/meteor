import React from 'react';
import PropTypes from 'prop-types';

import T from 'core/components/Translation';

import Progress from './Progress';

const BorrowerHeader = ({ borrowers, match, children }) => (
  <header className="borrower-header borrower-header--fixed p-d--16">
    <div className="borrower-header__row flex p-d--16">
      {borrowers.map((borrower, borrowerIndex) => (
        <div
          className="col--50 flex-col borrower-header__info flex--helper"
          key={borrower._id}
        >
          <div className="flex--row flex--center flex--helper borrower">
            <span className="fa fa-user-circle-o fa-5x" />
            <div className="borrower-header__user flex--helper flex--column">
              <h1 className="no-margin truncate">
                <span>
                  {borrower.firstName || (
                    <T
                      id="BorrowerHeader.title"
                      values={{ index: borrowerIndex + 1 }}
                    />
                  )}
                </span>
                <span>
                  {borrower.lastName || (
                    <T
                      id="BorrowerHeader.title"
                      values={{ index: borrowerIndex + 1 }}
                    />
                  )}
                </span>
              </h1>
              <div className="borrower-num">
                <T
                  id="BorrowerHeader.title"
                  values={{ index: borrowerIndex + 1 }}
                />
              </div>
            </div>
          </div>
          {children}
          <Progress borrower={borrower} match={match} />
        </div>
      ))}
    </div>
  </header>
);

BorrowerHeader.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default BorrowerHeader;
