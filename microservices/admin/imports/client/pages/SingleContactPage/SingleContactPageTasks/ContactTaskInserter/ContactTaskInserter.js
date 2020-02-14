import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { CONTACTS_COLLECTION } from 'core/api/constants';
import ContactTaskInsertForm from './ContactTaskInsertForm';
import {
  schema,
  taskFormLayout,
} from '../../../../components/TasksTable/TaskModifier';

const ContactTaskInserter = withProps(
  ({ contactId, model = {}, resetForm }) => ({
    onSubmit: values =>
      taskInsert
        .run({
          object: {
            docId: contactId,
            collection: CONTACTS_COLLECTION,
            ...values,
          },
        })
        .then(() => resetForm()),
    schema: schema.omit('status'),
    model: {
      ...model,
    },
    buttonLabelId: 'ContactTaskInsertForm.label',
    formTitleId: 'ContactTaskInsertForm.dialogTitle',
    formDescriptionId: 'ContactTaskInsertForm.dialogDescription',
    layout: taskFormLayout,
  }),
);

export default ContactTaskInserter(ContactTaskInsertForm);
