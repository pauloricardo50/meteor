import SimpleSchema from 'simpl-schema';

import { withProps } from 'recompose';
import { activityInsert } from 'core/api/activities/methodDefinitions';
import { INSURANCES_COLLECTION } from 'core/api/constants';
import {
  getActivitySchema,
  AdminActivityForm,
} from '../../../components/AdminTimeline/AdminActivityAdder';

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
  }).extend(getActivitySchema());

export default withProps(({ availableDocuments = [] }) => ({
  schema: getSchema(availableDocuments),
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
}))(AdminActivityForm);
