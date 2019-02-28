import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { propertyPermissionsSchema } from '../../api/properties/schemas/PropertySchema';
import { makePermissions } from '../../api/helpers/sharedSchemas';
import {
  proPropertySetProUserPermissions,
  getUserNameAndOrganisation,
} from '../../api';

const userPermissionsSchema = ({ user }) => {
  const permissionsSchema = Object.keys(propertyPermissionsSchema)
    .filter(key => !key.includes('displayCustomerNames'))
    .reduce(
      (permissions, key) => ({
        ...permissions,
        [key]: propertyPermissionsSchema[key],
      }),
      {},
    );

  const displayCustomerNamesSchema = Object.keys(propertyPermissionsSchema)
    .filter(key =>
      key.includes('displayCustomerNames') && key !== 'displayCustomerNames')
    .reduce(
      (permissions, key) => ({
        ...permissions,
        [`permissions.${key}`]: propertyPermissionsSchema[key],
      }),
      {
        'permissions.displayCustomerNames': { type: Object, optional: true },
      },
    );

  return new SimpleSchema({
    ...makePermissions({
      permissionsSchema,
      prefix: 'permissions',
      autoFormLabel: `Permissions de ${getUserNameAndOrganisation({ user })}`,
    }),
    ...displayCustomerNamesSchema,
  });
};

export default withProps(({ user, propertyId }) => ({
  schema: userPermissionsSchema({ user }),
  model: user && user.$metadata && user.$metadata,
  onSubmit: ({ permissions }) =>
    proPropertySetProUserPermissions.run({
      propertyId,
      userId: user._id,
      permissions,
    }),
}));
