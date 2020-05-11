import React, { useMemo } from 'react';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { withSmartQuery } from '../../../api/containerToolkit';
import { promotionUpdate } from '../../../api/promotions/methodDefinitions';
import { ROLES, USERS_COLLECTION } from '../../../api/users/userConstants';
import AutoForm, { CustomAutoField } from '../../AutoForm2';
import T from '../../Translation';

const getSchema = admins =>
  new SimpleSchema({
    assignedEmployeeId: {
      type: String,
      allowedValues: admins.map(({ _id }) => _id),
      uniforms: {
        transform: assignedEmployeeId =>
          admins.find(({ _id }) => assignedEmployeeId === _id)?.name,
        labelProps: { shrink: true },
        grouping: {
          groupBy: ({ id }) => admins.find(({ _id }) => id === _id)?.office,
          format: office => <T id={`Forms.office.${office}`} />,
        },
      },
    },
  });

const PromotionAssignee = ({ schema, promotion }) => (
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
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      name: 1,
      office: 1,
      $options: { sort: { firstName: 1 } },
    },
    dataName: 'admins',
    smallLoader: true,
  }),
  withProps(({ admins }) => {
    const schema = useMemo(() => getSchema(admins), []);
    return { schema };
  }),
)(PromotionAssignee);
