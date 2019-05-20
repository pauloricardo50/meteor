import {
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
} from '../methodDefinitions';
import SecurityService from '../../security';
import Analytics from './Analytics';
import EVENTS from '../events';
import { LOGIN_IP_BLACKLIST } from '../constants';

analyticsLogin.setHandler((
  {
    userId,
    connection: {
      clientAddress,
      httpHeaders: { host },
    },
  },
  params,
) => {
  SecurityService.checkLoggedIn();

  // Don't track login events when impersonating
  if (!host.includes('admin')) {
    if (LOGIN_IP_BLACKLIST.includes(clientAddress)) {
      return;
    }
  }
  Analytics.identify({ userId, ...params });
  Analytics.track({ userId, event: EVENTS.USER.LOGGED_IN });
});

analyticsPage.setHandler((context, params) => {
  Analytics.page({ context, params });
});

analyticsVerifyEmail.setHandler(({ userId }, params) => {
  Analytics.track({ userId, event: EVENTS.USER.VERIFIED_EMAIL });
});
