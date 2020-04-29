import React, { useMemo } from 'react';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { withSmartQuery } from 'core/api/containerToolkit';
import { getUserNameAndOrganisation } from 'core/api/helpers';
import { adminOrganisations } from 'core/api/organisations/queries';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/users/userConstants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Box from 'core/components/Box';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import useSearchParams from 'core/hooks/useSearchParams';

import UserDialogFormContainer from './UserDialogFormContainer';

export const userFormLayout = [
  {
    Component: Box,
    title: <h4>Détails</h4>,
    className: 'mb-32',
    layout: [
      { className: 'grid-2', fields: ['firstName', 'lastName'] },
      'email',
      'phoneNumbers',
      'referredByUserId',
      'referredByOrganisation',
      'organisations',
    ],
  },
  {
    Component: Box,
    title: <h4>Options</h4>,
    fields: ['assignedEmployeeId', 'sendEnrollmentEmail'],
  },
];

const getSchema = ({ schema, organisations }) =>
  schema.extend(
    new SimpleSchema({
      sendEnrollmentEmail: {
        type: Boolean,
        optional: true,
        defaultValue: false,
      },
      referredByUserId: {
        type: String,
        optional: true,
        customAllowedValues: {
          query: adminUsers,
          params: () => ({
            roles: [ROLES.PRO, ROLES.ADMIN, ROLES.DEV],
            $body: {
              name: 1,
              organisations: { name: 1 },
              $options: { sort: { name: 1 } },
            },
          }),
          allowNull: true,
        },
        uniforms: {
          transform: pro =>
            pro ? getUserNameAndOrganisation({ user: pro }) : 'Personne',
          labelProps: { shrink: true },
          label: 'Référé par',
          placeholder: null,
        },
      },
      referredByOrganisation: {
        type: String,
        optional: true,
        allowedValues: organisations,
        uniforms: {
          transform: organisation =>
            organisation ? organisation.name : 'Aucune',
          labelProps: { shrink: true },
          label: 'Référé par organisation',
          placeholder: null,
        },
        customAutoValue: model => {
          const { referredByUserId, referredByOrganisation } = model;
          if (referredByOrganisation) {
            return referredByOrganisation;
          }

          if (!referredByUserId) {
            return null;
          }

          const org = organisations.find(({ users = [] }) =>
            users.some(
              ({ _id, $metadata: { isMain } }) =>
                _id === referredByUserId && isMain,
            ),
          );

          return org;
        },
      },
    }),
  );

const UserAdder = ({
  schema,
  currentUser: { _id: adminId },
  createUser,
  labels,
  organisations = [],
  model = {},
  openOnMount,
}) => {
  const finalSchema = useMemo(() => getSchema({ schema, organisations }), [
    schema,
    organisations,
  ]);

  return (
    <AutoFormDialog
      title={<T id="UserAdder.buttonLabel" />}
      schema={finalSchema}
      model={{ ...model, assignedEmployeeId: adminId }}
      openOnMount={openOnMount}
      onSubmit={createUser}
      buttonProps={{
        label: 'Compte',
        raised: true,
        primary: true,
        icon: <Icon type="add" />,
      }}
      autoFieldProps={{
        labels: {
          ...labels,
          sendEnrollmentEmail: <T id="UserAdder.sendEnrollmentEmail" />,
        },
      }}
      layout={userFormLayout}
    />
  );
};

export default compose(
  UserDialogFormContainer,
  withSmartQuery({
    query: adminOrganisations,
    dataName: 'organisations',
    params: () => ({ $body: { name: 1, users: { _id: 1 } } }),
  }),
  withProps(() => {
    const searchParams = useSearchParams();
    return {
      model: searchParams,
      openOnMount:
        searchParams.addUser &&
        !!Object.keys(searchParams).filter(key =>
          ['email', 'firstName', 'lastName'].includes(key),
        ).length,
    };
  }),
)(UserAdder);
