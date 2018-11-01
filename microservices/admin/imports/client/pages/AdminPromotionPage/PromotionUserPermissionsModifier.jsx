// @flow
import React from 'react';

import SimpleSchema from 'simpl-schema';
import { PROMOTION_USER_PERMISSIONS } from 'core/api/constants';
import AutoForm, { makeCustomAutoField } from 'core/components/AutoForm2';
import { setPromotionUserPermissions } from 'core/api';

type PromotionUserModifierProps = {
  promotionId: String,
  user: Object,
};

const userPermissionsSchema = new SimpleSchema({
  permissions: {
    type: String,
    allowedValues: Object.values(PROMOTION_USER_PERMISSIONS),
  },
});

const PermissionsField = makeCustomAutoField({
  labels: { permissions: null },
});

const PromotionUserModifier = ({
  promotionId,
  user,
}: PromotionUserModifierProps) => (
  <AutoForm
    autosave
    schema={userPermissionsSchema}
    model={{ permissions: user.$metadata.permissions }}
    onSubmit={({ permissions }) =>
      setPromotionUserPermissions.run({
        promotionId,
        userId: user._id,
        permissions,
      })
    }
    className="update-field"
  >
    <PermissionsField name="permissions" />
  </AutoForm>
);

export default PromotionUserModifier;
