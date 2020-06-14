import React, { useMemo } from 'react';
import merge from 'lodash/merge';
import { compose, withProps } from 'recompose';

import { percentageField } from 'core/api/helpers/sharedSchemas';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import {
  revenueInsert,
  revenueRemove,
  revenueUpdate,
} from 'core/api/revenues/methodDefinitions';
import { REVENUE_STATUS } from 'core/api/revenues/revenueConstants';
import RevenueSchema from 'core/api/revenues/schemas/revenueSchema';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import Box from 'core/components/Box';
import T from 'core/components/Translation';
import useCurrentUser from 'core/hooks/useCurrentUser';

const getSchema = (currentUser) =>
  RevenueSchema.omit(
    'assigneeLink',
    'createdAt',
    'loanCache',
    'organisationLinks',
    'paidAt',
    'sourceOrganisationLink',
    'status',
    'updatedAt',
  ).extend({
    assigneeLink: { type: Object, optional: true, uniforms: { label: ' ' } },
    'assigneeLink._id': {
      type: String,
      defaultValue: currentUser?._id,
      customAllowedValues: {
        query: USERS_COLLECTION,
        params: {
          $filters: { 'roles._id': ROLES.ADVISOR },
          firstName: 1,
          $options: { sort: { firstName: 1 } },
        },
      },
      uniforms: {
        transform: (assignee) => assignee?.firstName,
        labelProps: { shrink: true },
        label: 'Responsable du revenu',
        displayEmtpy: false,
        placeholder: '',
      },
    },
    sourceOrganisationLink: { type: Object, optional: true },
    'sourceOrganisationLink._id': {
      optional: true,
      type: String,
      customAllowedValues: {
        query: ORGANISATIONS_COLLECTION,
        params: () => ({ name: 1, $options: { sort: { name: 1 } } }),
      },
      uniforms: {
        transform: (org) => org?.name,
        labelProps: { shrink: true },
        label: <T id="Forms.organisationName" />,
        displayEmtpy: false,
        placeholder: '',
      },
    },
    organisationLinks: {
      type: Array,
      defaultValue: [],
      uniforms: { label: null },
    },
    'organisationLinks.$': Object,
    'organisationLinks.$._id': {
      type: String,
      customAllowedValues: {
        query: ORGANISATIONS_COLLECTION,
        params: () => ({ name: 1, $options: { sort: { name: 1 } } }),
      },
      uniforms: {
        transform: (org) => org?.name,
        displayEmpty: false,
        labelProps: { shrink: true },
        placeholder: '',
      },
    },
    'organisationLinks.$.commissionRate': merge({}, percentageField, {
      uniforms: { labelProps: { shrink: true } },
      optional: false,
    }),
    paidAt: {
      type: Date,
      required: false,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
      condition: ({ status }) => status === REVENUE_STATUS.CLOSED,
    },
  });

const revenueFormLayout = [
  {
    Component: Box,
    title: <h5>Général</h5>,
    className: 'mb-32',
    layout: [
      { className: 'grid-col', fields: ['amount', 'type'] },
      'description',
    ],
  },
  {
    Component: Box,
    title: <h5>Responsable</h5>,
    className: 'mb-32 grid-2',
    fields: ['assigneeLink._id'],
  },
  {
    Component: Box,
    title: <h5>Payé par</h5>,
    className: 'mb-32 grid-2',
    fields: ['expectedAt', 'sourceOrganisationLink._id', 'paidAt'],
  },
  {
    Component: Box,
    title: <h5>Commissions à payer</h5>,
    fields: ['organisationLinks'],
  },
];

export default compose(
  withProps(
    ({
      loan,
      insurance,
      revenue,
      insuranceRequest,
      onSubmitted = () => null,
    }) => {
      const currentUser = useCurrentUser();
      const schema = useMemo(() => getSchema(currentUser), [currentUser]);

      return {
        schema,
        model: revenue,
        insertRevenue: (model) =>
          revenueInsert.run({
            revenue: model,
            loanId: loan?._id,
            insuranceId: insurance?._id,
            insuranceRequestId: insuranceRequest?._id,
          }),
        modifyRevenue: ({ _id: revenueId, ...object }) =>
          revenueUpdate.run({ revenueId, object }).finally(() => {
            onSubmitted();
          }),
        deleteRevenue: (revenueId) =>
          revenueRemove.run({ revenueId }).finally(() => {
            onSubmitted();
          }),
        layout: revenueFormLayout,
      };
    },
  ),
);
