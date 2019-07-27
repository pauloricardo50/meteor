// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { withProps } from 'recompose';
import { taskInsert } from 'core/api/tasks/index';
import { schema, taskFormLayout } from './TaskModifier';


type TaskAdderProps = {};

const TaskAdder = ({ insertTask }: TaskAdderProps) => (
  <AutoFormDialog
    schema={schema.omit('status')}
    model={{ assigneeLink: { _id: Meteor.userId() } }}
    buttonProps={{ label: 'Ajouter tâche', raised: true, primary: true }}
    onSubmit={insertTask}
    title="Ajouter tâche"
    layout={taskFormLayout}
  />
);

export default withProps({
  insertTask: values => taskInsert.run({ object: values }),
})(TaskAdder);
