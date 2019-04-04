import React from 'react';
import { compose, withProps, withState } from 'recompose';
import merge from 'lodash/merge';

import RevenueSchema from 'core/api/revenues/schemas/revenueSchema';
import {
  revenueInsert,
  revenueUpdate,
  revenueRemove,
} from 'core/api/revenues/index';
import message from 'core/utils/message';
import { percentageField } from 'core/api/helpers/sharedSchemas';
import { COMMISSION_STATUS } from 'core/api/constants';
import adminOrganisations from 'core/api/organisations/queries/adminOrganisations';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import T from 'core/components/Translation';

const schema = RevenueSchema.omit(
  'createdAt',
  'updatedAt',
  'organisationLinks',
).extend({
  organisationLinks: {
    type: Array,
    defaultValue: [],
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
  }),
  'organisationLinks.$.paidDate': {
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

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ loan: { _id: loanId }, revenue, setSubmitting, setOpen }) => ({
    schema,
    model: revenue,
    insertRevenue: model => revenueInsert.run({ revenue: model, loanId }),
    modifyRevenue: ({ _id: revenueId, ...object }) => {
      setSubmitting(true);
      return revenueUpdate
        .run({ revenueId, object })
        .then(() => {
          setOpen(false);
          message.success("C'est dans la boîte !", 2);
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
  })),
);
