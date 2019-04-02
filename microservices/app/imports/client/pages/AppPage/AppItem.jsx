import React from 'react';
import PropTypes from 'prop-types';
import Link from 'core/components/Link';

import T from 'core/components/Translation';
import BorrowersSummary from 'core/components/BorrowersSummary';
import LoanRenamer from './LoanRenamer';

const AppItem = ({
  loan: { _id: loanId, purchaseType, name, customName, borrowers, step },
}) => (
  <div className="app-item-wrapper">
    <Link
      className="card1 card-top card-hover flex-col app-item"
      to={`/loans/${loanId}`}
    >
      <h3 className="title">
        {customName ? (
          <span>
            {customName}&nbsp;-&nbsp;
            <T id={`Forms.purchaseType.${purchaseType}`} />
          </span>
        ) : (
          <T
            id="AppItem.title"
            values={{
              purchaseType: <T id={`Forms.purchaseType.${purchaseType}`} />,
            }}
          />
        )}
      </h3>
      <h4 className="subtitle secondary">
        <T id="AppItem.name" values={{ name }} />
      </h4>
      <BorrowersSummary borrowers={borrowers} />
      <h1 className="main-text text-center">
        <T id={`Forms.steps.${step}`} />
      </h1>
    </Link>
    <LoanRenamer loanId={loanId} customName={customName} />
  </div>
);

AppItem.propTypes = {};

AppItem.defaultProps = {};

export default AppItem;
