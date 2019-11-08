import { withProps, compose } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { withRouter } from 'react-router-dom';

import { anonymousCreateUser } from 'core/api/methods/index';
import {
  LOCAL_STORAGE_ANONYMOUS_LOAN,
  LOCAL_STORAGE_REFERRAL,
} from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import APP_ROUTES from 'imports/startup/client/appRoutes';
import { getCookie } from 'core/utils/cookiesHelpers';
import { TRACKING_COOKIE } from 'core/api/analytics/analyticsConstants';

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
    onSubmit: (values) => {
      const loanId = localStorage.getItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
      const referralId = localStorage.getItem(LOCAL_STORAGE_REFERRAL) || undefined;

      return anonymousCreateUser
        .run({
          user: values,
          trackingId: getCookie(TRACKING_COOKIE),
          referralId,

          // Remove null values
          loanId: loanId || undefined,
          ctaId,
        })
        .then(() => {
          localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
          localStorage.removeItem(LOCAL_STORAGE_REFERRAL);
          history.push(createRoute(APP_ROUTES.SIGNUP_SUCCESS_PAGE.path, {
            email: values.email,
          }));
        });
    },
  })),
);
