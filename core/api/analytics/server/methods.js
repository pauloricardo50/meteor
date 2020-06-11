import SecurityService from '../../security';
import {
  analyticsCTA,
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
} from '../methodDefinitions';

// All these analytics methods are used to trigger analytics listeners
analyticsLogin.setHandler(() => {
  SecurityService.checkLoggedIn();
});

analyticsPage.setHandler(() => {});

analyticsVerifyEmail.setHandler(() => {});

analyticsCTA.setHandler(() => {});
