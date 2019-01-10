import React from 'react';
import PropTypes from 'prop-types';
import Link from 'core/components/Link';

import { T, Money } from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { propertyDelete } from 'imports/core/api/methods/index';
import { getPropertyAddress } from './SinglePropertyPage';

const SinglePropertyHeader = ({
  property: {
    _id: propertyId,
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
      <div>
        <h1>
          {getPropertyAddress({ address1, city, zipCode }) || (
            <T id="general.property" />
          )}
        </h1>
      </div>
      <div>
        <ConfirmMethod
          label="Supprimer"
          method={() => propertyDelete.run({ propertyId })}
          buttonProps={{ error: true }}
        />
      </div>
    </div>

    <h2>
      <Money value={value} />
    </h2>

    <div className="bottom">
      <p className="created-at">
        {user && (
          <T
            id="SinglePropertyPageHeader.metadata"
            values={{
              user: (
                <Link to={`/users/${user._id}`} key="userLink">
                  <b>{user.name}</b>
                </Link>
              ),
              date: <FullDate date={createdAt} />,
            }}
          />
        )}
      </p>
    </div>
  </div>
);

SinglePropertyHeader.propTypes = {
  property: PropTypes.object.isRequired,
};

export default SinglePropertyHeader;
