// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';
import { compose } from 'recompose';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import Box from 'core/components/Box';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/constants';
import { getUserNameAndOrganisation } from 'core/api/helpers';
import { adminOrganisations } from 'core/api/organisations/queries';
import { withSmartQuery } from 'core/api';
import UserDialogFormContainer from './UserDialogFormContainer';

type UserAdderProps = {
  schema: Object,
  currentUser: Object,
  createUser: Function,
  labels: Array<Object>,
};

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

const UserAdder = ({
  schema,
  currentUser: { _id: adminId },
  createUser,
  labels,
  organisations = [],
}: UserAdderProps) => (
  <AutoFormDialog
    title={<T id="UserAdder.buttonLabel" />}
    schema={schema.extend(
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
    )}
    model={{ assignedEmployeeId: adminId }}
    onSubmit={createUser}
    buttonProps={{
      label: <T id="UserAdder.buttonLabel" />,
      raised: true,
      primary: true,
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

export default compose(
  UserDialogFormContainer,
  withSmartQuery({
    query: adminOrganisations,
    dataName: 'organisations',
    params: () => ({ $body: { name: 1, users: { _id: 1 } } }),
  }),
)(UserAdder);
