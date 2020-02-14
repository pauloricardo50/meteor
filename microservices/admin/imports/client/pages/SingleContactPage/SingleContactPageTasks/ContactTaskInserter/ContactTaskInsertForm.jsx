import React from 'react';

import T from 'core/components/Translation';
import { AutoFormDialog } from 'core/components/AutoForm2';

const ContactTaskInsertForm = ({
  formTitleId,
  formDescriptionId,
  buttonLabelId,
  schema,
  ...props
}) => (
  <div className="contact-task-insert-form">
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

export default ContactTaskInsertForm;
