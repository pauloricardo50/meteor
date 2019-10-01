// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { CollectionIconLink } from 'core/components/IconLink';
import { getUserNameAndOrganisation } from '../../../api/helpers';

type PromotionCustomerProps = {};

const PromotionCustomer = ({
  user,
  promotionUsers,
  invitedBy,
}: PromotionCustomerProps) => {
  const { _id, name, phoneNumbers = ['-'], email } = user;
  const isPro = Meteor.microservice === 'pro';
  const invitedByUser = invitedBy
    && promotionUsers
    && (!!promotionUsers.length
      && promotionUsers.find(({ _id: id }) => id === invitedBy));

  const invitingUser = invitedByUser
    ? getUserNameAndOrganisation({ user: invitedByUser })
    : 'Personne';

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
              {invitingUser}
            </div>
          </div>
        )
      }
    />
  );
};

export default PromotionCustomer;
