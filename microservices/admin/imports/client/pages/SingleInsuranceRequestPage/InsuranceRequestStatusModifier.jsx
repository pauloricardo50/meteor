import React from 'react';
import { withProps } from 'recompose';

import { INSURANCE_REQUEST_STATUS } from 'core/api/insuranceRequests/insuranceRequestConstants';
import {
  insuranceRequestUpdate,
  insuranceRequestUpdateStatus,
} from 'core/api/insuranceRequests/methodDefinitions';
import InsuranceRequestSchema from 'core/api/insuranceRequests/schemas/InsuranceRequestSchema';

import StatusModifier from '../../components/StatusModifier';
import UnsuccessfulReasonDialogForm from '../../components/UnsuccessfulReasonDialogForm/UnsuccessfulReasonDialogForm';

const unsuccessfulReasonSchema = InsuranceRequestSchema.pick(
  'unsuccessfulReason',
).extend({
  unsuccessfulReason: { optional: false },
});

export const additionalActionsConfig = {
  [INSURANCE_REQUEST_STATUS.UNSUCCESSFUL]: ({
    doc: insuranceRequest,
    resolve,
  }) => ({
    modals: [
      <UnsuccessfulReasonDialogForm
        schema={unsuccessfulReasonSchema}
        doc={insuranceRequest}
        onSubmit={({ unsuccessfulReason }) =>
          insuranceRequestUpdate
            .run({
              insuranceRequestId: insuranceRequest._id,
              object: { unsuccessfulReason },
            })
            .then(() => resolve())
        }
        key="reason"
      />,
    ],
  }),
};

const InsuranceRequestStatusModifier = withProps(({ insuranceRequest }) => ({
  doc: insuranceRequest,
  method: status =>
    insuranceRequestUpdateStatus.run({
      insuranceRequestId: insuranceRequest._id,
      status,
    }),
  additionalActionsConfig,
}));

export default InsuranceRequestStatusModifier(StatusModifier);
