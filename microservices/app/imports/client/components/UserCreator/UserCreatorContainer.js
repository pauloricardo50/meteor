import { withProps, compose } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';

import { anonymousCreateUser } from 'core/api/methods/index';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import { SIGNUP_SUCCESS_PAGE } from 'imports/startup/client/appRoutes';

const schema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: { type: String, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, minCount: 1 },
  'phoneNumbers.$': String,
});

export default compose(
  withRouter,
  withProps(({ history }) => ({
    schema,
    onSubmit: values =>
      anonymousCreateUser
        .run({
          user: values,
          loanId: localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN),
        })
        .then(() => {
          localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
          history.push(createRoute(SIGNUP_SUCCESS_PAGE, { email: values.email }));
        }),
  })),
);
