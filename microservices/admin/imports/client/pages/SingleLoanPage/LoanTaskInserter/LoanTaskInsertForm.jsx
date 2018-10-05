// @flow
import React from 'react';

import { DialogForm, FIELD_TYPES } from 'core/components/Form';
import T from 'core/components/Translation';
import Button from 'core/components/Button';

const formArray = [{ id: 'title', fieldType: FIELD_TYPES.TEXT }].map(field => ({
  ...field,
  label: <T id={`LoanTaskInsertForm.${field.id}`} />,
  required: true,
}));

type LoanTaskInsertFormProps = {
  formTitleId: String,
  formDescriptionId: String,
  buttonLabelId: String,
};

const LoanTaskInsertForm = ({
  formTitleId,
  formDescriptionId,
  buttonLabelId,
  ...props
}: LoanTaskInsertFormProps) => (
  <div className="loan-task-insert-form">
    <DialogForm
      formArray={formArray}
      title={<T id={formTitleId} />}
      description={<T id={formDescriptionId} />}
      button={(
        <Button raised primary>
          <T id={buttonLabelId} />
        </Button>
      )}
      {...props}
    />
  </div>
);

export default LoanTaskInsertForm;
