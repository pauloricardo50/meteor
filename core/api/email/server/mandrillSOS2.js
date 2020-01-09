import { Meteor } from 'meteor/meteor';

import SecurityService from 'core/api/security/index';
import { mandrillQueue } from './mandrillSOS';
import { sendMandrillTemplate } from './mandrill';

const sendAllTemplates = () => {
  const queued = mandrillQueue.find({}).fetch();

  queued.forEach(sendMandrillTemplate);

  console.log('YOOOOOOOOO BITCH');
  console.log('YOOOOOOOOO BITCH');
  console.log('YOOOOOOOOO BITCH');
  console.log('YOOOOOOOOO BITCH');
  console.log(`Sent ${queued.length} emails`);
  return queued.length;
};

Meteor.methods({
  sendQueuedMandrillItems() {
    SecurityService.checkCurrentUserIsDev();
    return sendAllTemplates();
  },
});
