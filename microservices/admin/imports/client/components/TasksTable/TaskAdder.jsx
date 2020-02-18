import { Meteor } from 'meteor/meteor';

import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { withProps } from 'recompose';
import { taskInsert } from 'core/api/tasks/index';
import { schema, taskFormLayout } from './TaskModifier';

const TaskAdder = ({
  insertTask,
  label = 'Ajouter tâche',
  model = {},
  openOnMount,
}) => (
  <AutoFormDialog
    schema={schema.omit('status')}
    model={{ ...model, assigneeLink: { _id: Meteor.userId() } }}
    buttonProps={{ label, raised: true, primary: true }}
    onSubmit={insertTask}
    title="Ajouter tâche"
    layout={taskFormLayout}
    openOnMount={openOnMount}
  />
);

export default withProps(({ resetForm = () => {} }) => ({
  insertTask: values =>
    taskInsert.run({ object: values }).then(() => resetForm()),
}))(TaskAdder);
