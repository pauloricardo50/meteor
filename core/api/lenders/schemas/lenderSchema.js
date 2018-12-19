import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { LENDERS_STATUS } from '../lenderConstants';

const LenderSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  status: {
    type: String,
    allowedValues: Object.values(LENDERS_STATUS),
    defaultValue: LENDERS_STATUS.TO_CONTACT,
  },
  contactLink: { type: Object, optional: true },
  'contactLink._id': { type: String, optional: true },
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
});

export default LenderSchema;
