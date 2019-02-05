import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import merge from 'lodash/merge';

import {
  PROMOTION_PERMISSIONS_PACKAGES,
  PROMOTION_PERMISSIONS,
} from 'core/api/constants';
import { makePermissions } from 'core/api/helpers/sharedSchemas';
import { promotionPermissionsSchema } from 'core/api/promotions/schemas/PromotionSchema';
import { setPromotionUserPermissions } from 'imports/core/api/methods/index';

const packagesSchema = {
  usePackages: { type: Boolean, defaultValue: false },
  packages: {
    optional: true,
    type: Array,
    defaultValue: [],
    condition: ({ usePackages }) => usePackages,
    uniforms: { displayEmpty: false, placeholder: '', checkboxes: true },
  },
  'packages.$': {
    type: String,
    allowedValues: Object.keys(PROMOTION_PERMISSIONS_PACKAGES),
  },
  packagesSettings: {
    type: Object,
    optional: true,
    condition: ({ usePackages, packages = [] }) =>
      usePackages && packages.includes('CONSULTATION'),
  },
  'packagesSettings.consultation': {
    type: Object,
    optional: true,
    condition: ({ usePackages, packages = [] }) =>
      usePackages && packages.includes('CONSULTATION'),
  },
  'packagesSettings.consultation.forLotStatus': {
    type: Array,
    optional: true,
    defaultValue: [],
    uniforms: { displayEmpty: false, placeholder: '', checkboxes: true },
  },
  'packagesSettings.consultation.forLotStatus.$': {
    type: String,
    allowedValues: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS),
  },
  'packagesSettings.consultation.invitedBy': {
    type: String,
    optional: true,
    allowedValues: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY),
    defaultValue:
      PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ORGANISATION,
    uniforms: { displayEmpty: false, placeholder: '' },
  },
};

const userPermissionsSchema = new SimpleSchema({
  ...packagesSchema,
  ...makePermissions({
    permissionsSchema: promotionPermissionsSchema,
    prefix: 'permissions',
    autoFormDisplayCondition: ({ usePackages }) => !usePackages,
  }),
});

const makeUserPermissions = ({
  usePackages,
  packages = [],
  packagesSettings = {},
  permissions,
}) => {
  if (usePackages) {
    const packagesPermissions = {};
    packages.forEach((packageName) => {
      merge(
        packagesPermissions,
        PROMOTION_PERMISSIONS_PACKAGES[packageName](packagesSettings),
      );
    });

    return packagesPermissions;
  }

  return permissions;
};

export default withProps(({ user, promotionId }) => ({
  schema: userPermissionsSchema,
  model: user && user.$metadata,
  onSubmit: model =>
    setPromotionUserPermissions.run({
      promotionId,
      userId: user._id,
      permissions: makeUserPermissions(model),
    }),
}));
