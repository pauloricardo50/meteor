import { Meteor } from 'meteor/meteor';

import SecurityService from 'core/api/security/index';
import { mandrillQueue } from './mandrillSOS';
import { sendMandrillTemplate } from './mandrill';

const sendAllTemplates = async () => {
  const queued = mandrillQueue.find({}).fetch();

  await Promise.all(
    queued.map(({ template, emailId, address }) =>
      sendMandrillTemplate(template).then(response => {
        this.addEmailActivity({ address, template, emailId, response });
      }),
    ),
  );

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
