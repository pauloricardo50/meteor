import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import {
  schema,
  taskFormLayout,
} from '../../../../components/TasksTable/TaskModifier';
import OrganisationTaskInsertForm from './OrganisationTaskInsertForm';

const OrganisationTaskInserter = withProps(({ organisationId }) => ({
  onSubmit: values =>
    taskInsert.run({
      object: {
        docId: organisationId,
        collection: ORGANISATIONS_COLLECTION,
        ...values,
      },
    }),
  schema: schema.omit('status'),
  model: {
    assigneeLink: {
      _id: Meteor.userId(),
    },
  },
  buttonLabelId: 'OrganisationTaskInsertForm.label',
  formTitleId: 'OrganisationTaskInsertForm.dialogTitle',
  formDescriptionId: 'OrganisationTaskInsertForm.dialogDescription',
  layout: taskFormLayout,
}));

export default OrganisationTaskInserter(OrganisationTaskInsertForm);
