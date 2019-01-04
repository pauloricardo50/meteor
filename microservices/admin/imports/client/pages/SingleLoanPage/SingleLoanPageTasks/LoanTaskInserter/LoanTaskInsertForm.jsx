// @flow
import React from 'react';

import T from 'core/components/Translation';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { taskSchema } from 'imports/client/components/TasksTable/TaskModifier';

type LoanTaskInsertFormProps = {
  formTitleId: String,
  formDescriptionId: String,
  buttonLabelId: String,
};

const LoanTaskInsertForm = ({
  formTitleId,
  formDescriptionId,
  buttonLabelId,
  admins,
  ...props
}: LoanTaskInsertFormProps) => (
  <div className="loan-task-insert-form">
    <AutoFormDialog
      schema={taskSchema(admins)}
      title={<T id={formTitleId} />}
      description={<T id={formDescriptionId} />}
      buttonProps={{
        raised: true,
        primary: true,
        label: <T id={buttonLabelId} />,
      }}
      {...props}
    />
  </div>
);

export default LoanTaskInsertForm;
