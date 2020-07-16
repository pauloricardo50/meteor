import React, { useState } from 'react';

import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { LENDERS_COLLECTION } from 'core/api/lenders/lenderConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { taskInsert } from 'core/api/tasks/methodDefinitions';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { AutoFormDialog } from 'core/components/AutoForm2';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import useCurrentUser from 'core/hooks/useCurrentUser';
import useSearchParams from 'core/hooks/useSearchParams';

import { taskFormSchema } from './taskFormHelpers';
import { taskFormLayout } from './TaskModifier';

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

const TaskAdder = ({
  collection,
  docId,
  label = 'Tâche',
  model = {},
  schema = taskFormSchema,
  onSubmit = values =>
    taskInsert.run({ object: { docId, collection, ...values } }),
  className,
  watchSearchParams,
  ...rest
}) => {
  const currentUser = useCurrentUser();
  const initialSearchParams = useSearchParams();
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const openOnMount = searchParams.addTask;

  const finalModel = watchSearchParams ? searchParams || model : model;

  return (
    <AutoFormDialog
      schema={schema.omit('status')}
      model={{ ...finalModel, assigneeLink: { _id: currentUser._id } }}
      buttonProps={{
        label,
        raised: true,
        primary: true,
        icon: <Icon type="add" />,
        className,
      }}
      onSubmit={values => onSubmit(values).then(() => setSearchParams({}))}
      title={<T id="TaskAdder.title" />}
      description={
        <T
          id="TaskAdder.description"
          values={{ collectionLabel: getCollectionLabel(collection) }}
        />
      }
      layout={taskFormLayout}
      openOnMount={openOnMount}
      {...rest}
    />
  );
};

export default TaskAdder;
