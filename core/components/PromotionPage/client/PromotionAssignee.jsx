// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import query from 'core/api/users/queries/adminUsers';
import { withSmartQuery, promotionUpdate } from '../../../api';
import AutoForm, { CustomAutoField } from '../../AutoForm2';

type PromotionAssigneeProps = {};

const getSchema = admins =>
  new SimpleSchema({
    assignedEmployeeId: {
      type: String,
      allowedValues: admins.map(({ _id }) => _id),
      uniforms: {
        transform: assignedEmployeeId =>
          admins.find(({ _id }) => assignedEmployeeId === _id).name,
        labelProps: { shrink: true },
      },
    },
  });

const PromotionAssignee = ({ schema, promotion }: PromotionAssigneeProps) => (
  <AutoForm
    autosave
    schema={schema}
    model={{
      assignedEmployeeId: promotion.assignedEmployee
        ? promotion.assignedEmployee._id
        : null,
    }}
    onSubmit={values =>
      promotionUpdate.run({ promotionId: promotion._id, object: values })
    }
  >
    <CustomAutoField name="assignedEmployeeId" />
  </AutoForm>
);

export default compose(
  withSmartQuery({
    query,
    params: { admins: true, $body: { name: 1 } },
    dataName: 'admins',
    smallLoader: true,
  }),
  withProps(({ admins }) => ({ schema: getSchema(admins) })),
)(PromotionAssignee);
