import { analyticsIdentify } from '../methodDefinitions';
import SecurityService from '../../security';
import Analytics from './Analytics';

analyticsIdentify.setHandler(({ userId }, params) => {
  SecurityService.checkLoggedIn();
  Analytics.identify({ userId, ...params });
});
