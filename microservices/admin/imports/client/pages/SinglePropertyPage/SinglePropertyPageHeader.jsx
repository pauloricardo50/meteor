import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { T, Money } from 'core/components/Translation';
import FullDate from 'core/components/dateComponents/FullDate';
import ConfirmMethod from 'core/components/ConfirmMethod';
import { propertyDelete } from 'core/api/methods';
import { USERS_COLLECTION } from 'core/api/constants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { getPropertyAddress } from './SinglePropertyPage';

const SinglePropertyHeader = ({
  property: {
    _id: propertyId,
    address1,
    city,
    createdAt,
    totalValue,
    updatedAt,
    user,
    zipCode,
  },
  loanId,
}) => {
  const title = getPropertyAddress({ address1, city, zipCode });
  return (
    <div className="single-property-page-header">
      {title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      <div className="top">
        <div>
          <h1>{title || <T id="general.property" />}</h1>
        </div>
        <div>
          <ConfirmMethod
            label="Supprimer"
            method={() => propertyDelete.run({ propertyId, loanId })}
            buttonProps={{ error: true }}
          >
            <p>
              Si ce bien immobilier est partagé entre plusieurs dossiers, il ne
              sera pas supprimé, mais juste enlevé de ce dossier.
            </p>
          </ConfirmMethod>
        </div>
      </div>

      <h2 className="secondary">
        <Money value={totalValue} />
      </h2>

      <div className="bottom">
        <p className="created-at">
          {user && (
            <CollectionIconLink
              relatedDoc={{ ...user, collection: USERS_COLLECTION }}
            />
          )}
          {user && user.assignedEmployee && (
            <span>
              <T id="SinglePropertyPageHeader.assignedTo" />
              &nbsp;
              <CollectionIconLink
                relatedDoc={{
                  ...user.assignedEmployee,
                  collection: USERS_COLLECTION,
                }}
              />
            </span>
          )}
          <span>
            Créé à &nbsp;
            <FullDate date={createdAt} />
          </span>
          <span>
            Modifié à &nbsp;
            <FullDate date={updatedAt} />
          </span>
        </p>
      </div>
    </div>
  );
};

SinglePropertyHeader.propTypes = {
  property: PropTypes.object.isRequired,
};

export default SinglePropertyHeader;
