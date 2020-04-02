import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { propertyDelete } from 'core/api/methods';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import FullDate from 'core/components/dateComponents/FullDate';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { Money, T } from 'core/components/Translation';

const SinglePropertyHeader = ({
  property: {
    _id: propertyId,
    createdAt,
    totalValue,
    updatedAt,
    user,
    address,
  },
  loanId,
}) => (
  <div className="single-property-page-header">
    {address && (
      <Helmet>
        <title>{address}</title>
      </Helmet>
    )}
    <div className="top">
      <div>
        <h1>{address || <T id="general.property" />}</h1>
      </div>
      <div>
        <ConfirmMethod
          label="Supprimer"
          method={() => propertyDelete.run({ propertyId, loanId })}
          buttonProps={{ error: true, outlined: true }}
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
SinglePropertyHeader.propTypes = {
  property: PropTypes.object.isRequired,
};

export default SinglePropertyHeader;
