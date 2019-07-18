import SimpleSchema from 'simpl-schema';

import { PROPERTY_DOCUMENTS } from 'core/api/files/fileConstants';
import { checkQuery, impersonateSchema } from './helpers';

const uploadFileAPI = ({ user: { _id: userId }, body, query }) => {
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

  const bodySchema = new SimpleSchema({
    propertyId: String,
    category: {
      type: String,
      custom() {
        let allowedValues;
        if (this.field('propertyId').value) {
          allowedValues = Object.keys(PROPERTY_DOCUMENTS);
        }
        if (!allowedValues.includes(this.value)) {
          return `Category "${this.value}" is not allowed`;
        }
      },
    },
    file: Object,
    'file.name': String,
    'file.size': Number,
    'file.type': String,
  });
};
