import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';
import merge from 'lodash/merge';

import {
  PROMOTION_PERMISSIONS_BUNDLES,
  PROMOTION_PERMISSIONS,
} from 'core/api/constants';
import { makePermissions } from 'core/api/helpers/sharedSchemas';
import { promotionPermissionsSchema } from 'core/api/promotions/schemas/PromotionSchema';
import { setPromotionUserPermissions } from 'imports/core/api/methods/index';

const bundlesSchema = {
  useBundles: { type: Boolean, defaultValue: false },
  bundles: {
    optional: true,
    type: Array,
    defaultValue: [],
    condition: ({ useBundles }) => useBundles,
    uniforms: { displayEmpty: false, placeholder: '', checkboxes: true },
  },
  'bundles.$': {
    type: String,
    allowedValues: Object.keys(PROMOTION_PERMISSIONS_BUNDLES),
  },
  bundlesSettings: {
    type: Object,
    optional: true,
    condition: ({ useBundles, bundles = [] }) =>
      useBundles && bundles.includes('CONSULTATION'),
  },
  'bundlesSettings.consultation': {
    type: Object,
    optional: true,
    condition: ({ useBundles, bundles = [] }) =>
      useBundles && bundles.includes('CONSULTATION'),
  },
  'bundlesSettings.consultation.forLotStatus': {
    type: Array,
    optional: true,
    defaultValue: [],
    uniforms: { displayEmpty: false, placeholder: '', checkboxes: true },
  },
  'bundlesSettings.consultation.forLotStatus.$': {
    type: String,
    allowedValues: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS),
  },
  'bundlesSettings.consultation.invitedBy': {
    type: String,
    optional: true,
    allowedValues: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY),
    defaultValue:
      PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ORGANISATION,
    uniforms: { displayEmpty: false, placeholder: '' },
  },
};

const userPermissionsSchema = new SimpleSchema({
  ...bundlesSchema,
  ...makePermissions({
    permissionsSchema: promotionPermissionsSchema,
    prefix: 'permissions',
    autoFormDisplayCondition: ({ useBundles }) => !useBundles,
  }),
});

const makeUserPermissions = ({
  useBundles,
  bundles = [],
  bundlesSettings = {},
  permissions,
}) => {
  if (useBundles) {
    const bundlesPermissions = {};
    bundles.forEach((bundleName) => {
      merge(
        bundlesPermissions,
        PROMOTION_PERMISSIONS_BUNDLES[bundleName](bundlesSettings),
      );
    });

    return bundlesPermissions;
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
