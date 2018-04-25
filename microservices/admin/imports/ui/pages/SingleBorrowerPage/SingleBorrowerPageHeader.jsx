import React from 'react';
import PropTypes from 'prop-types';

import { T } from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';
import { getBorrowerFullName } from 'core/utils/borrowerFunctions';

const SingleBorrowerHeader = ({
  borrower: {
    address,
    age,
    gender,
    firstName,
    lastName,
    createdAt,
    user: { emails, assignedEmployee },
  },
}) => (
  <div className="single-user-page-header">
    <div className="top">
      <h1>
        {getBorrowerFullName({ firstName, lastName }) || (
          <T id="general.borrower" />
        )}
        <small className="secondary">
          {`${gender}, ${(
            <T id="SingleBorrowerHeader.age" value={age} />
          )}, ${address}`}
        </small>
      </h1>
    </div>

    <div className="bottom">
      <p className="secondary created-at">
        <T id="SingleBorrowerHeader.createdBy" />
        {` ${emails[0].address} `}
        <FullDate date={createdAt} />
      </p>

      {assignedEmployee && (
        <p>
          &nbsp; - &nbsp;
          <T id="SingleBorrowerHeader.assignedTo" />{' '}
          {assignedEmployee.emails[0].address}
        </p>
      )}
    </div>
  </div>
);

SingleBorrowerHeader.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default SingleBorrowerHeader;
