import { Meteor } from 'meteor/meteor';
import { createContainer } from 'core/api';

const ArrayInputContainer = createContainer(({ popFunc, updateFunc }) => ({
  popFunc: params =>
    new Promise((resolve, reject) => {
      Meteor.call(popFunc, params, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    }),
  updateFunc: params =>
    new Promise((resolve, reject) => {
      Meteor.call(updateFunc, params, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    }),
}));

export default ArrayInputContainer;
