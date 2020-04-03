import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { borrowerDelete } from 'core/api/borrowers/methodDefinitions';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import ConfirmMethod from 'core/components/ConfirmMethod';
import FullDate from 'core/components/dateComponents/FullDate';
import { CollectionIconLink } from 'core/components/IconLink';
import T from 'core/components/Translation';

const SingleBorrowerHeader = ({
  borrower: {
    address1,
    age,
    gender,
    name,
    createdAt,
    updatedAt,
    user,
    _id: borrowerId,
  },
}) => (
  <div className="single-borrower-page-header">
    {name && (
      <Helmet>
        <title>{name}</title>
      </Helmet>
    )}
    <div className="top">
      <div>
        <h1>{name || <T id="general.borrower" />}</h1>
      </div>
      <div>
        <ConfirmMethod
          buttonProps={{ outlined: true, error: true }}
          label="Supprimer"
          method={() => borrowerDelete.run({ borrowerId })}
        />
      </div>
    </div>

    {gender && age && address1 && (
      <p className="secondary">
        {`${gender}, `}
        <T id="SingleBorrowerPageHeader.age" values={{ value: age }} />
        {`, ${address1}`}
      </p>
    )}

    <div className="bottom">
      <p className="created-at">
        {user && (
          <CollectionIconLink
            relatedDoc={{ ...user, collection: USERS_COLLECTION }}
          />
        )}
        {user && user.assignedEmployee && (
          <span>
            <T id="SingleBorrowerPageHeader.assignedTo" />
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

SingleBorrowerHeader.propTypes = {
  borrower: PropTypes.object.isRequired,
};

export default SingleBorrowerHeader;
