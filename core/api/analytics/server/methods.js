import {
  analyticsCTA,
  analyticsLogin,
  analyticsOpenedIntercom,
  analyticsPage,
  analyticsVerifyEmail,
} from '../methodDefinitions';

// All these analytics methods are used to trigger analytics listeners
analyticsLogin.setHandler(() => {});

analyticsPage.setHandler(() => {});

analyticsVerifyEmail.setHandler(() => {});

analyticsCTA.setHandler(() => {});

analyticsOpenedIntercom.setHandler(() => {});
