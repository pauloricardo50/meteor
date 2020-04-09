import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { anonymousCreateUser } from 'core/api/users/methodDefinitions';
import { LOCAL_STORAGE_REFERRAL } from 'core/api/users/userConstants';
import { getCookie } from 'core/utils/cookiesHelpers';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../startup/client/appRoutes';

export const userSchema = new SimpleSchema({
  firstName: String,
  lastName: String,
  email: { type: String, regEx: SimpleSchema.RegEx.Email },
  phoneNumber: String,
});

export default compose(
  withRouter,
  withProps(({ history, omitValues = [], ctaId }) => ({
    schema: userSchema.omit(...omitValues),
    onSubmit: values => {
      const loanId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      const referralId =
        localStorage.getItem(LOCAL_STORAGE_REFERRAL) || undefined;

      return anonymousCreateUser
        .run({
          user: values,
          trackingId: getCookie(TRACKING_COOKIE),
          referralId,

          // Remove null values
          loanId: loanId || undefined,
          ctaId,
        })
        .finally(() => {
          localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
          localStorage.removeItem(LOCAL_STORAGE_REFERRAL);
          history.push(
            createRoute(APP_ROUTES.SIGNUP_SUCCESS_PAGE.path, {
              email: values.email,
            }),
          );
        });
    },
  })),
);
