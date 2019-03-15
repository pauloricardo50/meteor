import { Mongo } from 'meteor/mongo';

import LoanSchema from './schemas/LoanSchema';
import { LOANS_COLLECTION } from './loanConstants';

const Loans = new Mongo.Collection(LOANS_COLLECTION);

// Prevent all client side modifications of mongoDB
Loans.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
Loans.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Loans.attachSchema(LoanSchema);
export default Loans;
