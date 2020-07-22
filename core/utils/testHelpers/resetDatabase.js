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

  console.time('reset');
  xolvioResetDatabase({ excludedCollections: ['roles'] });
  console.timeEnd('reset');
};

export default resetDatabase;
