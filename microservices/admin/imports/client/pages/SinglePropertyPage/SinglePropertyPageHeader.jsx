import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { T, MetricArea, Money } from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';
import { getPropertyAddress } from './SinglePropertyPage';

const SinglePropertyHeader = ({
  property: {
    address1,
    city,
    zipCode,
    value,
    roomCount,
    insideArea,
    createdAt,
    user,
  },
}) => (
  <div className="single-property-page-header">
    <div className="top">
      <h1>
        {getPropertyAddress({ address1, city, zipCode }) || (
          <T id="general.property" />
        )}
      </h1>
    </div>

    <h2>
      <Money value={value} />
    </h2>

    <p className="secondary">
      {roomCount && (
        <T
          id="SinglePropertyPageHeader.roomCount"
          values={{ value: roomCount }}
        />
      )}
      {insideArea && [', ', <MetricArea value={insideArea} key="insideArea" />]}
    </p>

    <div className="bottom">
      <p className="created-at">
        {user && [
          <T id="SinglePropertyPageHeader.createdBy" key="createdBy" />,
          ' ',
          <Link to={`/users/${user._id}`} key="userLink">
            {user.emails[0].address}
          </Link>,
          ', ',
        ]}

        <FullDate date={createdAt} />

        {user &&
          user.assignedEmployee && (
          <span>
            {' - '}
            <T id="SinglePropertyPageHeader.assignedTo" />{' '}
            <Link to={`/users/${user.assignedEmployee._id}`}>
              {user.assignedEmployee.emails[0].address}
            </Link>
          </span>
        )}
      </p>
    </div>
  </div>
);

SinglePropertyHeader.propTypes = {
  property: PropTypes.object.isRequired,
};

export default SinglePropertyHeader;
