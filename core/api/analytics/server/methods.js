import {
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
} from '../methodDefinitions';
import SecurityService from '../../security';
import Analytics from './Analytics';
import EVENTS from '../events';

analyticsLogin.setHandler(({ userId }, params) => {
  SecurityService.checkLoggedIn();
  Analytics.identify({ userId, ...params });
  Analytics.track({ userId, event: EVENTS.USER.LOGGED_IN });
});

analyticsPage.setHandler((context, params) => {
  Analytics.page({ context, params });
});

analyticsVerifyEmail.setHandler(({ userId }, params) => {
  Analytics.track({ userId, event: EVENTS.USER.VERIFIED_EMAIL });
});
