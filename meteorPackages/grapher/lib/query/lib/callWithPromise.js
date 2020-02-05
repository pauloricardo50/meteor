export default (method, myParameters) =>
  new Promise((resolve, reject) => {
    Meteor.call(method, myParameters, (err, res) => {
      if (err) reject(err.reason || 'Something went wrong.');

      resolve(res);
    });
  });
