import { useMemo } from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import uniqBy from 'lodash/uniqBy';

import { insuranceRequestInsert } from 'core/api/insuranceRequests/methodDefinitions';
import { ROLES } from 'core/api/constants';
import { adminUsers } from 'core/api/users/queries';

const getSchema = ({ availableBorrowers = [], withKeepAssigneesCheckbox }) =>
  new SimpleSchema({
    keepAssignees: {
      type: Boolean,
      defaultValue: false,
      uniforms: { label: 'Garder les mêmes conseillers' },
      condition: () => withKeepAssigneesCheckbox,
    },
    assigneeLinks: {
      type: Array,
      optional: true,
      uniforms: { label: 'Conseillers' },
      condition: ({ keepAssignees }) => !keepAssignees,
    },
    'assigneeLinks.$': Object,
    'assigneeLinks.$._id': {
      type: String,
      customAllowedValues: {
        query: adminUsers,
        params: () => ({
          roles: [ROLES.ADMIN],
          $body: { name: 1, $options: { sort: { name: 1 } } },
        }),
      },
      uniforms: {
        transform: user => (user ? user.name : ''),
        label: 'Conseiller',
        placeholder: null,
      },
    },
    'assigneeLinks.$.percent': {
      type: SimpleSchema.Integer,
      min: 10,
      max: 100,
      defaultValue: 100,
      uniforms: { label: 'Assist %' },
    },
    'assigneeLinks.$.isMain': {
      type: Boolean,
      defaultValue: false,
      uniforms: { label: 'Conseiller principal' },
    },
    note: {
      type: String,
      optional: true,
      uniforms: {
        placeholder: 'Expliquer la raison de la nouvelle répartition',
      },
      condition: ({ keepAssignees }) => !keepAssignees,
    },
    updateUserAssignee: {
      type: Boolean,
      defaultValue: false,
      optional: true,
      uniforms: { label: "Assigner le conseiller principal à l'utilisateur" },
      condition: ({ keepAssignees }) => !keepAssignees,
    },
    ...(availableBorrowers?.length
      ? {
          borrowerIds: {
            type: Array,
            optional: true,
            defaultValue: [],
            maxCount: 2,
            uniforms: { checkboxes: true, label: 'Assurés' },
          },
          'borrowerIds.$': {
            type: String,
            allowedValues: availableBorrowers.map(({ _id }) => _id),
            optional: true,
            uniforms: {
              transform: borrowerId =>
                availableBorrowers.find(({ _id }) => _id === borrowerId).name ||
                'Emprunteur sans nom',
            },
          },
        }
      : {}),
  });

export default withProps(
  ({
    user = {},
    loan = {},
    withKeepAssigneesCheckbox = true,
    onSuccess = () => ({}),
  }) => {
    const {
      _id: userId,
      assignedEmployee = {},
      borrowers: userBorrowers = [],
    } = user;

    const {
      _id: loanId,
      assigneeLinks = [],
      borrowers: loanBorrowers = [],
    } = loan;

    const availableBorrowers = uniqBy(
      [...userBorrowers, ...loanBorrowers],
      '_id',
    );

    const schema = useMemo(
      () =>
        getSchema({
          availableBorrowers,
          withKeepAssigneesCheckbox,
        }),
      [availableBorrowers, withKeepAssigneesCheckbox],
    );

    return {
      schema,
      model: {
        assigneeLinks: assigneeLinks.length
          ? assigneeLinks
          : [{ _id: assignedEmployee._id, percent: 100, isMain: true }],
        keepAssignees: !!assigneeLinks.length,
        note: assigneeLinks.length ? '' : 'Répartition initiale',
      },
      onSubmit: ({
        keepAssignees,
        assigneeLinks: assignees,
        note,
        updateUserAssignee,
        borrowerIds = [],
      }) =>
        insuranceRequestInsert
          .run({
            loanId,
            userId,
            ...(keepAssignees ? {} : { assignees, note, updateUserAssignee }),
            borrowerIds,
          })
          .then(onSuccess),
    };
  },
);
