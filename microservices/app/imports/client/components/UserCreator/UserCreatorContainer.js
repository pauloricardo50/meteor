import { withProps, compose } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';

import { anonymousCreateUser } from 'core/api/methods/index';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import ROUTES from 'imports/startup/client/appRoutes';
import { getCookie } from 'core/utils/cookiesHelpers';
import { TRACKING_COOKIE } from 'core/api/analytics/constants';

export const userSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: { type: String, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, minCount: 1 },
  'phoneNumbers.$': String,
});

export default compose(
  withRouter,
  withProps(({ history }) => ({
    schema: userSchema,
    onSubmit: (values) => {
      const loanId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);

      return anonymousCreateUser
        .run({
          user: values,
          trackingId: getCookie(TRACKING_COOKIE),

          // Remove null values
          loanId: loanId || undefined,
        })
        .then(() => {
          localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
          history.push(createRoute(ROUTES.SIGNUP_SUCCESS_PAGE.path, {
            email: values.email,
          }));
        });
    },
  })),
);
