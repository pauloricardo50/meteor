import React from 'react';
import { compose, withProps, withState } from 'recompose';
import merge from 'lodash/merge';

import RevenueSchema from 'core/api/revenues/schemas/revenueSchema';
import {
  revenueInsert,
  revenueUpdate,
  revenueRemove,
} from 'core/api/revenues/index';
import { percentageField } from 'core/api/helpers/sharedSchemas';
import { COMMISSION_STATUS } from 'core/api/constants';
import { adminOrganisations } from 'core/api/organisations/queries';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import T from 'core/components/Translation';
import Box from 'core/components/Box';

const schema = RevenueSchema.omit(
  'createdAt',
  'updatedAt',
  'organisationLinks',
  'sourceOrganisationLink',
  'loanCache',
  'status',
  'paidAt',
).extend({
  sourceOrganisationLink: { type: Object, optional: true },
  'sourceOrganisationLink._id': {
    optional: true,
    type: String,
    customAllowedValues: {
      query: adminOrganisations,
      params: () => ({ $body: { name: 1 } }),
    },
    uniforms: {
      transform: ({ name }) => name,
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
      query: adminOrganisations,
      params: () => ({ $body: { name: 1 } }),
    },
    uniforms: {
      transform: ({ name }) => name,
      displayEmpty: false,
      labelProps: { shrink: true },
      placeholder: '',
    },
  },
  'organisationLinks.$.commissionRate': merge({}, percentageField, {
    uniforms: { labelProps: { shrink: true } },
    optional: false,
  }),
  'organisationLinks.$.paidAt': {
    type: Date,
    optional: true,
    defaultValue: null,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  'organisationLinks.$.status': {
    type: String,
    allowedValues: Object.values(COMMISSION_STATUS),
    defaultValue: COMMISSION_STATUS.TO_BE_PAID,
    uniforms: {
      displayEmpty: false,
      placeholder: '',
      transform: status => <T id={`Forms.status.${status}`} />,
    },
  },
});

const revenueFormLayout = [
  {
    Component: Box,
    title: <h4>Général</h4>,
    className: 'mb-32',
    layout: [
      { className: 'grid-col', fields: ['amount', 'type', 'secondaryType'] },
      'description',
    ],
  },
  {
    Component: Box,
    title: <h4>Payé par</h4>,
    className: 'mb-32 grid-2',
    fields: ['expectedAt', 'sourceOrganisationLink._id'],
  },
  {
    Component: Box,
    title: <h4>Commissions à payer</h4>,
    fields: ['organisationLinks'],
  },
];

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ loan, revenue, setSubmitting, setOpen }) => ({
    schema,
    model: revenue,
    insertRevenue: model =>
      revenueInsert.run({ revenue: model, loanId: loan && loan._id }),
    modifyRevenue: ({ _id: revenueId, ...object }) => {
      setSubmitting(true);
      return revenueUpdate
        .run({ revenueId, object })
        .then(() => {
          setOpen(false);
          import('../../../core/utils/message').then(({ default: message }) => {
            message.success("C'est dans la boîte !", 2);
          });
        })
        .finally(() => setSubmitting(false));
    },
    deleteRevenue: ({ revenueId, closeDialog, setDisableActions }) => {
      setSubmitting(true);
      setDisableActions(true);
      const confirm = window.confirm('Êtes-vous sûr ?');
      if (confirm) {
        return revenueRemove
          .run({ revenueId })
          .then(closeDialog)
          .finally(() => {
            setDisableActions(false);
            setSubmitting(false);
          });
      }

      setDisableActions(false);
      setSubmitting(false);
      return Promise.resolve();
    },
    layout: revenueFormLayout,
  })),
);
