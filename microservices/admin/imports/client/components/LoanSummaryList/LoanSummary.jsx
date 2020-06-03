import React from 'react';
import PropTypes from 'prop-types';

import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import BorrowersSummary from 'core/components/BorrowersSummary';
import { CollectionIconLink } from 'core/components/IconLink';
import Link from 'core/components/Link';
import StatusLabel from 'core/components/StatusLabel';
import T from 'core/components/Translation';

import LoanSummaryColumns from './LoanSummaryColumns';

const getLoanName = ({ name, customName }) => {
  if (!customName) {
    return name;
  }

  return `${name} - ${customName}`;
};

export const loanSummaryFragment = {
  borrowers: { name: 1 },
  createdAt: 1,
  customName: 1,
  name: 1,
  promotionOptions: { value: 1, promotionLots: { name: 1 } },
  promotions: { name: 1, status: 1 },
  properties: { address1: 1, totalValue: 1, category: 1 },
  status: 1,
  structure: 1,
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
            <div className="flex center-align">
              <CollectionIconLink
                relatedDoc={promotions[0]}
                iconClassName="mr-4"
              />
              <StatusLabel
                status={promotions[0].status}
                collection={PROMOTIONS_COLLECTION}
              />
            </div>
          </div>
        )}

        {proProperties.length > 0 && (
          <div className="mr-16">
            <h5>
              <T id="collections.properties" />
            </h5>
            {proProperties.map(prop => (
              <CollectionIconLink key={prop._id} relatedDoc={prop} />
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
