import { analyticsIdentify, analyticsPage } from '../methodDefinitions';
import SecurityService from '../../security';
import Analytics from './Analytics';

analyticsIdentify.setHandler((context, params) => {
  SecurityService.checkLoggedIn();
  Analytics.identify({ userId: context.userId, ...params });
});

analyticsPage.setHandler((context, params) => {
  Analytics.page({ context, params });
});
