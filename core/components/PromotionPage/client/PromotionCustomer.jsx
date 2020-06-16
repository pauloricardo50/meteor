import React from 'react';

import { getUserNameAndOrganisation } from '../../../api/helpers';
import ProCustomer from '../../ProCustomer';
import { usePromotion } from './PromotionPageContext';

const PromotionCustomer = ({ user, invitedBy }) => {
  const {
    promotion: { users },
  } = usePromotion();
  const invitedByUser = users?.find(({ _id }) => _id === invitedBy);

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
