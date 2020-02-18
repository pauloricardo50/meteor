import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import { schema, taskFormLayout } from './TaskModifier';

const CollectionTaskInserterForm = ({
  title,
  description,
  label,
  ...props
}) => (
  <div className="collection-task-inserter-form">
    <AutoFormDialog
      schema={schema.omit('status')}
      title={title}
      description={description}
      buttonProps={{
        raised: true,
        primary: true,
        label,
      }}
      {...props}
    />
  </div>
);

const CollectionTaskInserter = withProps(
  ({ doc: { _id: docId }, model = {}, resetForm = () => {}, collection }) => ({
    onSubmit: values =>
      taskInsert
        .run({
          object: { docId, collection, ...values },
        })
        .then(() => resetForm()),
    model: {
      ...model,
      assigneeLink: {
        _id: Meteor.userId(),
      },
    },
    label: <T id="CollectionTaskInserter.label" />,
    title: <T id="CollectionTaskInserter.title" />,
    description: <T id="CollectionTaskInserter.description" />,
    layout: taskFormLayout,
  }),
);

export default CollectionTaskInserter(CollectionTaskInserterForm);
