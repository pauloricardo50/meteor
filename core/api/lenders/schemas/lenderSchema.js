import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { LENDER_STATUS } from '../lenderConstants';

const LenderSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  status: {
    type: String,
    allowedValues: Object.values(LENDER_STATUS),
    defaultValue: LENDER_STATUS.TO_BE_CONTACTED,
  },
  contactLink: { type: Object, optional: true },
  'contactLink._id': { type: String, optional: true },
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
  loanLink: { type: Object, optional: true },
  'loanLink._id': { type: String, optional: true },
  adminNote: { type: String, optional: true },
});

export default LenderSchema;
