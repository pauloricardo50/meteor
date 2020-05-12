import React, { useMemo } from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';
import {
  activityInsert,
  activityRemove,
  activityUpdate,
} from 'core/api/activities/methodDefinitions';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import Icon from 'core/components/Icon';

export const getActivitySchema = (activitiesFilter = () => true) =>
  new SimpleSchema({
    title: String,
    description: { type: String, optional: true },
    date: {
      type: Date,
      uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
      defaultValue: new Date(),
    },
    type: {
      type: String,
      allowedValues: Object.values(ACTIVITY_TYPES).filter(activitiesFilter),
      uniforms: { placeholder: null },
    },
    shouldNotify: { type: Boolean, defaultValue: false },
    isImportant: { type: Boolean, defaultValue: false },
  });

export const activityFormLayout = [
  { className: 'grid-col', fields: ['title', 'type'] },
  { className: 'grid-col', fields: ['date', 'shouldNotify'] },
  'description',
  'isImportant',
];

export const AdminActivityForm = ({
  model = {},
  onSubmit,
  iconType,
  className = '',
  buttonProps = {},
  schema,
  layout,
  activitiesFilter,
  ...rest
}) => {
  const activitySchema = useMemo(
    () => schema || getActivitySchema(activitiesFilter),
    [activitiesFilter, schema],
  );

  return (
    <AutoFormDialog
      schema={activitySchema}
      model={model}
      onSubmit={onSubmit}
      layout={layout || activityFormLayout}
      buttonProps={{
        className,
        label: 'Activité',
        raised: true,
        primary: true,
        icon: <Icon type="add" />,
        style: { margin: '0 8px' },
        ...buttonProps,
      }}
      {...rest}
    />
  );
};

export const AdminActivityModifier = withProps(({ model }) => ({
  onSubmit: values =>
    activityUpdate.run({ activityId: model._id, object: values }),
  buttonProps: {
    icon: <Icon type="edit" fontSize="small" />,
    fab: true,
    label: null,
    style: {},
    tooltip: 'Modifier',
    size: 'small',
  },
  onDelete: () => activityRemove.run({ activityId: model._id }),
  title: 'Modifier événement',
}))(AdminActivityForm);

export default withProps(({ docId, collection }) => {
  let methodParams;

  switch (collection) {
    case LOANS_COLLECTION:
      methodParams = { loanLink: { _id: docId } };
      break;
    case USERS_COLLECTION:
      methodParams = { userLink: { _id: docId } };
      break;
    case INSURANCE_REQUESTS_COLLECTION:
      methodParams = { insuranceRequestLink: { _id: docId } };
      break;
    default:
      break;
  }

  return {
    onSubmit: values =>
      activityInsert.run({ object: { ...values, ...methodParams } }),
    iconType: 'add',
    title: 'Ajouter événement',
  };
})(AdminActivityForm);
