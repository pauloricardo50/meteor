import {
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
  analyticsCTA,
} from '../methodDefinitions';
import SecurityService from '../../security';

// All these analytics methods are used to trigger analytics listeners
analyticsLogin.setHandler(() => {
  SecurityService.checkLoggedIn();
});

analyticsPage.setHandler(() => {});

analyticsVerifyEmail.setHandler(() => {});

analyticsCTA.setHandler(() => {});
