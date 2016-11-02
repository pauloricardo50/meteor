import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { DocHead } from 'meteor/kadira:dochead';
import { CreditRequests } from '/imports/api/creditrequests/creditrequests.js';

// Use the underscore as a temporary substitute to export it again under its "real" name below
import _Step1Page from '/imports/ui/pages/user/Step1Page.jsx';
import _Step2Page from '/imports/ui/pages/user/Step2Page.jsx';
import _Step3Page from '/imports/ui/pages/user/Step3Page.jsx';
import _Step4Page from '/imports/ui/pages/user/Step4Page.jsx';
import _Step5Page from '/imports/ui/pages/user/Step5Page.jsx';

import Loading from '/imports/ui/components/general/Loading.jsx';

function composer(props, onData) {
  if (Meteor.subscribe('activeCreditRequest').ready()) {
    const creditRequest = CreditRequests.find({}).fetch()[0];
    onData(null, { creditRequest });
  }
  DocHead.setTitle('Étape X - e-Potek');
}

// export default composeWithTracker(composer, Loading)(Step1Page);

export const Step1Page = composeWithTracker(composer, Loading)(_Step1Page);
export const Step2Page = composeWithTracker(composer, Loading)(_Step2Page);
export const Step3Page = composeWithTracker(composer, Loading)(_Step3Page);
export const Step4Page = composeWithTracker(composer, Loading)(_Step4Page);
export const Step5Page = composeWithTracker(composer, Loading)(_Step5Page);
