import React from 'react';
import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import { AutoFormDialog } from 'core/components/AutoForm2';
import Icon from 'core/components/Icon';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import {
  activityInsert,
  activityUpdate,
  activityRemove,
} from 'core/api/activities/methodDefinitions';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { ACTIVITY_TYPES } from 'core/api/activities/activityConstants';

export const ActivitySchema = new SimpleSchema({
  title: String,
  description: { type: String, optional: true },
  date: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    defaultValue: new Date(),
  },
  type: {
    type: String,
    allowedValues: Object.values(ACTIVITY_TYPES),
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

export const LoanActivityForm = ({
  model = {},
  onSubmit,
  iconType,
  className = '',
  ...rest
}) => (
  <AutoFormDialog
    schema={ActivitySchema}
    model={model}
    onSubmit={onSubmit}
    layout={activityFormLayout}
    buttonProps={{
      className,
      label: 'Activité',
      raised: true,
      primary: true,
      icon: <Icon type="add" />,
      style: { margin: '0 8px' },
    }}
    {...rest}
  />
);

export const LoanActivityModifier = withProps(({ model }) => ({
  onSubmit: values =>
    activityUpdate.run({ activityId: model._id, object: values }),
  iconType: 'edit',
  renderAdditionalActions: ({ closeDialog, setDisableActions }) => (
    <Button
      onClick={() => {
        setDisableActions(true);
        return activityRemove
          .run({ activityId: model._id })
          .then(closeDialog)
          .finally(() => setDisableActions(false));
      }}
      error
    >
      <T id="general.delete" />
    </Button>
  ),
  title: 'Modifier événement',
}))(LoanActivityForm);

export default withProps(({ loanId }) => ({
  onSubmit: values =>
    activityInsert.run({ object: { ...values, loanLink: { _id: loanId } } }),
  iconType: 'add',
  title: 'Ajouter événement',
}))(LoanActivityForm);
