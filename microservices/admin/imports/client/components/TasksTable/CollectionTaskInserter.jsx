import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import {
  USERS_COLLECTION,
  LOANS_COLLECTION,
  PROMOTIONS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  LENDERS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';
import { schema, taskFormLayout } from './TaskModifier';

const getCollectionLabel = collection => {
  switch (collection) {
    case USERS_COLLECTION:
      return 'ce compte';
    case LOANS_COLLECTION:
      return 'cette hypothèque';
    case PROMOTIONS_COLLECTION:
      return 'cette promotion';
    case ORGANISATIONS_COLLECTION:
      return 'cette organisation';
    case LENDERS_COLLECTION:
      return 'ce prêteur';
    case CONTACTS_COLLECTION:
      return 'ce contact';
    default:
      return 'rien';
  }
};

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
    description: (
      <T
        id="CollectionTaskInserter.description"
        values={{ collectionLabel: getCollectionLabel(collection) }}
      />
    ),
    layout: taskFormLayout,
  }),
);

export default CollectionTaskInserter(CollectionTaskInserterForm);
