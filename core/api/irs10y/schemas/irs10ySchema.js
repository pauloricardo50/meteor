import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  percentageField,
} from '../../helpers/sharedSchemas';

const Irs10ySchema = new SimpleSchema({
  createdAt,
  updatedAt,
  date: Date,
  rate: { ...percentageField, optional: false },
});

export default Irs10ySchema;
