import React, { useContext, useMemo } from 'react';
import SimpleSchema from 'simpl-schema';

import { promotionUpdate } from '../../../api/promotions/methodDefinitions';
import AdminsContext from '../../../contexts/AdminsContext';
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

const PromotionAssignee = ({ promotion }) => {
  const { advisors } = useContext(AdminsContext);
  const schema = useMemo(() => getSchema(advisors), []);

  return (
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
};

export default PromotionAssignee;
