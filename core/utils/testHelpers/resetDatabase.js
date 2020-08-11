import { Meteor } from 'meteor/meteor';
import { resetDatabase as xolvioResetDatabase } from 'meteor/xolvio:cleaner';

const resetDatabase = () => {
  if (Meteor.isClient) {
    return new Promise((resolve, reject) => {
      Meteor.call('resetDatabase', (err, res) =>
        err ? reject(err) : resolve(res),
      );
    });
  }

  xolvioResetDatabase({ excludedCollections: ['roles'] });
};

export default resetDatabase;
