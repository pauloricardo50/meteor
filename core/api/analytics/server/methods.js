import {
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
  analyticsCTA,
} from '../methodDefinitions';
import SecurityService from '../../security';
import Analytics from './Analytics';
import EVENTS from '../events';

analyticsLogin.setHandler((context, params) => {
  SecurityService.checkLoggedIn();

  const analytics = new Analytics(context);
  analytics.identify();
  analytics.track(EVENTS.USER_LOGGED_IN);
});

analyticsPage.setHandler((context, params) => {
  const analytics = new Analytics(context);
  analytics.page(params);
});

analyticsVerifyEmail.setHandler((context, params) => {
  const analytics = new Analytics(context);
  analytics.identify(params.trackingId);
  analytics.track(EVENTS.USER_VERIFIED_EMAIL);
});

analyticsCTA.setHandler((context, params) => {
  const analytics = new Analytics(context);
  analytics.cta(params);
});
