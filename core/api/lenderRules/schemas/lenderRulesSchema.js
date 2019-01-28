import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';

const LenderRulesSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
});

export default LenderRulesSchema;
