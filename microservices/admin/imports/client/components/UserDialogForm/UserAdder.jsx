import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';

import { getUserNameAndOrganisation } from 'core/api/helpers';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { adminCreateUser } from 'core/api/users/methodDefinitions';
import {
  ASSIGNEE,
  ROLES,
  USERS_COLLECTION,
} from 'core/api/users/userConstants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Box from 'core/components/Box';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';
import useSearchParams from 'core/hooks/useSearchParams';

import { userFormSchema } from './userDialogFormHelpers';

export const userFormLayout = [
  {
    Component: Box,
    title: <h5>Détails</h5>,
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
    title: <h5>Options</h5>,
    fields: ['assignedEmployeeId', 'sendEnrollmentEmail'],
  },
];

const getSchema = (organisations, advisors) =>
  userFormSchema.omit('organisations').extend(
    new SimpleSchema({
      email: { type: String, optional: false, regEx: SimpleSchema.RegEx.Email },
      sendEnrollmentEmail: {
        type: Boolean,
        optional: true,
        defaultValue: false,
        uniforms: {
          label: <T id="UserAdder.sendEnrollmentEmail" />,
        },
      },
      referredByUserId: {
        type: String,
        optional: true,
        customAllowedValues: {
          query: USERS_COLLECTION,
          params: {
            $filters: { 'roles._id': ROLES.PRO },
            name: 1,
            organisations: { name: 1 },
            $options: { sort: { lastName: 1 } },
          },
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

          const org = organisations.find(({ userLinks = [] }) =>
            userLinks.some(
              ({ _id, isMain }) => _id === referredByUserId && isMain,
            ),
          );

          return org;
        },
      },
      assignedEmployeeId: {
        type: String,
        allowedValues: [
          ...Object.values(ASSIGNEE),
          ...advisors.map(({ _id }) => _id),
        ],
        uniforms: {
          data: [
            ...advisors,
            { _id: ASSIGNEE.NONE, label: 'Sans conseiller', office: 'Auto' },
            { _id: ASSIGNEE.ROUND_ROBIN, label: 'Round robin', office: 'Auto' },
          ],
          transform: item => item?.firstName || item?.label,
          grouping: {
            groupBy: 'office',
            format: office =>
              office === 'Auto' ? 'Auto' : <T id={`Forms.office.${office}`} />,
          },
        },
      },
    }),
  );

const UserAdder = ({ buttonProps }) => {
  const { data: organisations = [] } = useMeteorData({
    query: ORGANISATIONS_COLLECTION,
    params: {
      name: 1,
      userLinks: 1,
      $options: { sort: { name: 1 } },
    },
  });
  const { data: advisors = [] } = useMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      $options: { sort: { firstName: 1 } },
      firstName: 1,
      office: 1,
    },
  });
  const schema = useMemo(() => getSchema(organisations, advisors), [
    organisations,
    advisors,
  ]);
  const searchParams = useSearchParams();
  const history = useHistory();

  return (
    <AutoFormDialog
      title={<T id="UserAdder.buttonLabel" />}
      schema={schema}
      model={{ ...searchParams }}
      openOnMount={
        searchParams.addUser &&
        !!Object.keys(searchParams).filter(key =>
          ['email', 'firstName', 'lastName'].includes(key),
        ).length
      }
      onSubmit={data =>
        adminCreateUser
          .run({ user: { ...data, role: ROLES.USER } })
          .then(newId => history.push(`/users/${newId}`))
      }
      buttonProps={{
        label: 'Compte',
        raised: true,
        primary: true,
        icon: <Icon type="add" />,
        ...buttonProps,
      }}
      layout={userFormLayout}
    />
  );
};

export default UserAdder;
