import { Meteor } from 'meteor/meteor';

import { ORGANISATIONS_COLLECTION } from 'imports/core/api/organisations/organisationConstants';
import React from 'react';
import { withProps } from 'recompose';

import { taskInsert } from 'core/api';
import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { LENDERS_COLLECTION } from 'core/api/lenders/lenderConstants';

import { taskFormLayout, schema as taskSchema } from './TaskModifier';

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
    case INSURANCE_REQUESTS_COLLECTION:
      return 'ce dossier assurance';
    default:
      return 'rien';
  }
};

export const CollectionTaskInserterForm = ({
  title,
  description,
  label,
  schema,
  ...props
}) => (
  <div className="collection-task-inserter-form mr-8">
    <AutoFormDialog
      schema={schema || taskSchema.omit('status')}
      title={title}
      description={description}
      buttonProps={{
        raised: true,
        primary: true,
        label,
        icon: <Icon type="add" />,
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
