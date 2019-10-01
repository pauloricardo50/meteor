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
            <b>{name}</b>
            <div>
              <i>Email:</i>
              {' '}
              {email}
            </div>
            <div>
              <i>Tél:</i>
              {' '}
              {phoneNumbers[0]}
            </div>
            <div>
              <i>Invité par:</i>
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
