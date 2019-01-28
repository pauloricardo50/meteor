import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';

const LenderRulesSchema = new SimpleSchema({
  createdAt,
  updatedAt,
// Insert your schema here
// Example
// firstName: {type: String, optional: true},
});

export default LenderRulesSchema;
