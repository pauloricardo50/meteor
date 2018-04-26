import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';

const SingleBorrowerHeader = ({
  borrower: {
    address1,
    age,
    gender,
    firstName,
    lastName,
    createdAt,
    user: { _id, emails, assignedEmployee },
  },
}) => (
  <div className="single-borrower-page-header">
    <div className="top">
      <h1>
        {getBorrowerFullName({ firstName, lastName }) || (
          <T id="general.borrower" />
        )}
      </h1>
    </div>

    <p className="secondary">
      {`${gender}, `}
      <T id="SingleBorrowerPageHeader.age" values={{ value: age }} />
      {`, ${address1}`}
    </p>

    <div className="bottom">
      <p className="created-at">
        <T id="SingleBorrowerPageHeader.createdBy" />{' '}
        <Link to={`/users/${_id}`}>{emails[0].address}</Link>
        {', '}
        <FullDate date={createdAt} />
        {assignedEmployee && (
          <span>
            {' - '}
            <T id="SingleBorrowerPageHeader.assignedTo" />{' '}
            <Link to={`/users/${assignedEmployee._id}`}>
              {assignedEmployee.emails[0].address}
            </Link>
          </span>
        )}
      </p>
    </div>
  </div>
);

SingleBorrowerHeader.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default SingleBorrowerHeader;
