import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import merge from 'lodash/merge';

import {
  PROMOTION_PERMISSIONS_PACKAGES,
  PROMOTION_PERMISSIONS,
} from 'core/api/constants';
import { makePermissions } from 'core/api/helpers/sharedSchemas';
import { promotionPermissionsSchema } from 'core/api/promotions/schemas/PromotionSchema';

const packagesSchema = {
  usePackages: { type: Boolean, defaultValue: true },
  packages: {
    optional: true,
    type: Array,
    defaultValue: [],
    condition: ({ usePackages }) => usePackages,
    uniforms: { displayEmpty: false, placeholder: '' },
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
    uniforms: { displayEmpty: false, placeholder: '' },
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

export default withProps(({ user }) => ({
  schema: userPermissionsSchema,
  model: user && user.$metadata.permissions,
  onSubmit: model => console.log('permissions', makeUserPermissions(model)),
}));
