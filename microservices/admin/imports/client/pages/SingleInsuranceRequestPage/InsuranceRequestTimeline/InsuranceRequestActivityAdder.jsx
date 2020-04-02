import { useMemo } from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { activityInsert } from 'core/api/activities/methodDefinitions';
import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';

import {
  AdminActivityForm,
  getActivitySchema,
} from '../../../components/AdminTimeline/AdminActivityAdder';

const activitySchema = getActivitySchema();

const getSchema = (availableDocuments = []) =>
  new SimpleSchema({
    docId: {
      type: String,
      allowedValues: availableDocuments.map(({ id }) => id),
      uniforms: {
        transform: docId =>
          availableDocuments.find(({ id }) => id === docId).label,
        label: 'Relatif à',
        allowNull: false,
        displayEmpty: false,
        checkboxes: true,
      },
    },
  }).extend(activitySchema);

export default withProps(({ availableDocuments = [] }) => {
  const schema = useMemo(() => getSchema(availableDocuments), [
    availableDocuments,
  ]);

  return {
    schema,
    layout: [
      'docId',
      { className: 'grid-col', fields: ['title', 'type'] },
      { className: 'grid-col', fields: ['date', 'shouldNotify'] },
      'description',
      'isImportant',
    ],
    onSubmit: ({ docId, ...values }) => {
      let methodParams;
      const { collection } = availableDocuments.find(({ id }) => id === docId);
      if (collection === INSURANCES_COLLECTION) {
        methodParams = { insuranceLink: { _id: docId } };
      } else {
        methodParams = { insuranceRequestLink: { _id: docId } };
      }

      return activityInsert.run({ object: { ...values, ...methodParams } });
    },
    iconType: 'add',
    title: 'Ajouter événement',
  };
})(AdminActivityForm);
