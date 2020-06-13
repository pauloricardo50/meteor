import React from 'react';
import SimpleSchema from 'simpl-schema';

import { updatePromotionUserRoles } from '../../../../api/promotions/methodDefinitions';
import { PROMOTION_USERS_ROLES } from '../../../../api/promotions/promotionConstants';
import { AutoFormDialog } from '../../../AutoForm2';
import IconButton from '../../../IconButton';
import Chip from '../../../Material/Chip';
import T from '../../../Translation';
import { usePromotion } from '../PromotionPageContext';

const schema = new SimpleSchema({
  roles: { type: Array },
  'roles.$': {
    type: String,
    allowedValues: Object.values(PROMOTION_USERS_ROLES),
  },
});

const PromotionUserRoles = ({ user }) => {
  const {
    permissions: { canManageProUsers },
    promotion: { _id: promotionId, name: promotionName },
  } = usePromotion();
  const {
    _id: userId,
    name,
    $metadata: { roles = [] },
  } = user;

  return (
    <div>
      {canManageProUsers && (
        <AutoFormDialog
          schema={schema}
          model={{ roles }}
          onSubmit={({ roles: newRoles = [] }) =>
            updatePromotionUserRoles.run({
              userId,
              promotionId,
              roles: newRoles,
            })
          }
          triggerComponent={handleOpen => (
            <IconButton type="edit" size="small" onClick={handleOpen} />
          )}
          title={`Changer rôles de ${name} sur ${promotionName}`}
        />
      )}

      {roles.map(role => (
        <Chip
          key={role}
          label={<T id={`Forms.roles.${role}`} />}
          className="mr-4"
        />
      ))}
    </div>
  );
};

export default PromotionUserRoles;
