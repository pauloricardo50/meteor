// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { USERS_COLLECTION } from '../../api/users/userConstants';
import { CollectionIconLink } from '../IconLink';

type ProCustomerProps = {};

const ProCustomer = ({ user, invitedByUser }: ProCustomerProps) => {
  const { _id, name, phoneNumbers = ['-'], email } = user;
  const isPro = Meteor.microservice === 'pro';

  return (
    <CollectionIconLink
      relatedDoc={{ name, _id, collection: USERS_COLLECTION }}
      alwaysShowData={user}
      noRoute={isPro}
      replacementPopup={
        isPro && (
          <div>
            <h4 style={{ marginTop: 0 }}>{name}</h4>
            <div>
              <b>Email:</b>
              {' '}
              {email}
            </div>
            <div>
              <b>Tél:</b>
              {' '}
              {phoneNumbers[0]}
            </div>
            <div>
              <b>Invité par:</b>
              {' '}
              {invitedByUser}
            </div>
          </div>
        )
      }
    />
  );
};

export default ProCustomer;
