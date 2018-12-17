import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';

const Irs10ySchema = new SimpleSchema({
  createdAt,
  updatedAt,
  date: Date,
  rate: { type: Number, min: 0, max: 1 },
});

export default Irs10ySchema;
