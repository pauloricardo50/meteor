import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import T from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';

const SingleBorrowerHeader = ({
  borrower: { address1, age, gender, name, createdAt, user },
}) => (
  <div className="single-borrower-page-header">
    <div className="top">
      <h1>{name || <T id="general.borrower" />}</h1>
    </div>

    <p className="secondary">
      {`${gender}, `}
      <T id="SingleBorrowerPageHeader.age" values={{ value: age }} />
      {`, ${address1}`}
    </p>

    <div className="bottom">
      <p className="created-at">
        {user && [
          <T id="SingleBorrowerPageHeader.createdBy" key="createdBy" />,
          ' ',
          <Link to={`/users/${user._id}`} key="userLink">
            {user.email}
          </Link>,
          ', ',
        ]}

        <FullDate date={createdAt} />

        {user
          && user.assignedEmployee && (
          <span>
            {' - '}
            <T id="SingleBorrowerPageHeader.assignedTo" />{' '}
            <Link to={`/users/${user.assignedEmployee._id}`}>
              {user.assignedEmployee.email}
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
