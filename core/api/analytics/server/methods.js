import {
  analyticsLogin,
  analyticsPage,
  analyticsVerifyEmail,
  analyticsCTA,
} from '../methodDefinitions';
import SecurityService from '../../security';

analyticsLogin.setHandler(() => {
  SecurityService.checkLoggedIn();
});

analyticsPage.setHandler(() => {});

analyticsVerifyEmail.setHandler(() => {});

analyticsCTA.setHandler(() => {});
