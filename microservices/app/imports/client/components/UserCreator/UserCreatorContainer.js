import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { anonymousCreateUser } from 'core/api/methods/index';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/constants';

const schema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: { type: String, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, minCount: 1 },
  'phoneNumbers.$': String,
});

export default withProps(() => ({
  schema,
  onSubmit: values =>
    anonymousCreateUser
      .run({
        user: values,
        loanId: localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
      })
      .then(() => {
        localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      }),
}));
