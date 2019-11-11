// @flow

import React from 'react';

import { getUserNameAndOrganisation } from '../../../api/helpers';
import ProCustomer from '../../ProCustomer';

type PromotionCustomerProps = {};

const PromotionCustomer = ({
  user,
  invitedBy,
  promotionUsers,
}: PromotionCustomerProps) => {
  const { _id, name, phoneNumbers = ['-'], email } = user;
  const invitedByUser =
    invitedBy &&
    promotionUsers &&
    !!promotionUsers.length &&
    promotionUsers.find(({ _id: id }) => id === invitedBy);

  return (
    <ProCustomer
      user={user}
      invitedByUser={
        invitedByUser
          ? getUserNameAndOrganisation({ user: invitedByUser })
          : 'Personne'
      }
    />
  );
};

export default PromotionCustomer;
