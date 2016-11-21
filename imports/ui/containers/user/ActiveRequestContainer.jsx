import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import CreditRequests from '/imports/api/creditrequests/creditrequests.js';

import Loading from '/imports/ui/components/general/Loading.jsx';


// Use the underscore as a temporary substitute to export it again under its "real" name below
import _MainPage from '/imports/ui/pages/user/MainPage.jsx';
import _TodoCardPage from '/imports/ui/pages/user/TodoCardPage.jsx';
import _FinancePage from '/imports/ui/pages/user/FinancePage.jsx';
import _ContactPage from '/imports/ui/pages/user/ContactPage.jsx';

import _Step1Page from '/imports/ui/pages/user/Step1Page.jsx';
import _Step2Page from '/imports/ui/pages/user/Step2Page.jsx';
import _Step3Page from '/imports/ui/pages/user/Step3Page.jsx';
import _Step4Page from '/imports/ui/pages/user/Step4Page.jsx';
import _Step5Page from '/imports/ui/pages/user/Step5Page.jsx';
import _Step6Page from '/imports/ui/pages/user/Step6Page.jsx';


import _RequestProgressBar from '/imports/ui/components/general/RequestProgressBar.jsx';
import _SideNav from '/imports/ui/components/general/SideNav.jsx';


// Container function which reactively send the currently active credit Request as a prop
function composer(props, onData) {
  if (Meteor.subscribe('activeCreditRequest').ready()) {
    const creditRequest = CreditRequests.find({}).fetch()[0];
    const path = FlowRouter.current().path;

    // If there is no creditRequest, go to the main page, except for new, settings and contact page
    if (!creditRequest && ((path.substring(0, 4) !== '/new') && (path !== '/settings') && (path !== '/contact'))) {
      FlowRouter.go('/main');
    }

    onData(null, { creditRequest });
  }
}


// export all the pages with their realname for comfort
export const MainPage = composeWithTracker(composer, Loading)(_MainPage);
export const TodoCardPage = composeWithTracker(composer, Loading)(_TodoCardPage);
export const FinancePage = composeWithTracker(composer, Loading)(_FinancePage);
export const ContactPage = composeWithTracker(composer, Loading)(_ContactPage);

export const Step1Page = composeWithTracker(composer, Loading)(_Step1Page);
export const Step2Page = composeWithTracker(composer, Loading)(_Step2Page);
export const Step3Page = composeWithTracker(composer, Loading)(_Step3Page);
export const Step4Page = composeWithTracker(composer, Loading)(_Step4Page);
export const Step5Page = composeWithTracker(composer, Loading)(_Step5Page);
export const Step6Page = composeWithTracker(composer, Loading)(_Step6Page);

export const RequestProgressBar = composeWithTracker(composer, Loading)(_RequestProgressBar);
export const SideNav = composeWithTracker(composer, Loading)(_SideNav);
