import PropTypes from 'prop-types';
import React from 'react';

import Link from 'core/components/Link';
import T from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import BorrowersSummary from 'core/components/BorrowersSummary';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import {
  PROPERTY_CATEGORY,
  PROPERTIES_COLLECTION,
} from 'core/api/properties/propertyConstants';

import LoanSummaryColumns from './LoanSummaryColumns';

const getLoanName = ({ name, customName }) => {
  if (!customName) {
    return name;
  }

  return `${name} - ${customName}`;
};

const LoanSummary = ({ loan }) => {
  const {
    _id,
    borrowers,
    name,
    customName,
    promotions = [],
    properties = [],
  } = loan;
  const loanName = getLoanName({ name, customName });

  const proProperties = properties.filter(
    ({ category }) => category === PROPERTY_CATEGORY.PRO,
  );

  return (
    <Link
      to={`/loans/${_id}`}
      className="card1 card-top card-hover loan-summary"
    >
      <h4>{loanName || <T id="general.loan" />}</h4>

      <LoanSummaryColumns loan={loan} />
      <div className="flex">
        <BorrowersSummary borrowers={borrowers} className="mr-16" />

        {promotions.length > 0 && (
          <div className="mr-16">
            <h5>
              <T id="collections.promotions" />
            </h5>
            <CollectionIconLink
              relatedDoc={{
                ...promotions[0],
                collection: PROMOTIONS_COLLECTION,
              }}
            />
          </div>
        )}

        {proProperties.length > 0 && (
          <div className="mr-16">
            <h5>
              <T id="collections.properties" />
            </h5>
            {proProperties.map(prop => (
              <CollectionIconLink
                key={prop._id}
                relatedDoc={{
                  ...prop,
                  collection: PROPERTIES_COLLECTION,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

LoanSummary.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default LoanSummary;
