// @flow
import React from 'react';

import T from 'core/components/Translation';
import { AutoFormDialog } from 'core/components/AutoForm2';

type LoanTaskInsertFormProps = {
  formTitleId: String,
  formDescriptionId: String,
  buttonLabelId: String,
  schema: Object,
};

const LoanTaskInsertForm = ({
  formTitleId,
  formDescriptionId,
  buttonLabelId,
  schema,
  ...props
}: LoanTaskInsertFormProps) => (
  <div className="loan-task-insert-form">
    <AutoFormDialog
      schema={schema}
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
