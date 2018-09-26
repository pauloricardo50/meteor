import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import BorrowersSummary from 'core/components/BorrowersSummary';

const AppItem = ({ loan }) => (
  <Link
    className="card1 card-top card-hover flex-col app-item"
    to={`/loans/${loan._id}`}
  >
    <h3 className="title">
      <T
        id="AppItem.title"
        values={{
          purchaseType: (
            <T id={`Forms.purchaseType.${loan.general.purchaseType}`} />
          ),
        }}
      />
    </h3>
    <h4 className="subtitle secondary">
      <T id="AppItem.name" values={{ name: loan.name }} />
    </h4>
    <BorrowersSummary borrowers={loan.borrowers} />
    <h1 className="main-text text-center">
      <T id={`steps.${loan.logic.step}`} />
    </h1>
  </Link>
);

AppItem.propTypes = {};

AppItem.defaultProps = {};

export default AppItem;
