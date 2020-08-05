const { Accounts } = require('meteor/accounts-base');

Accounts.config({
  // Higher rounds are better for security, but much slower
  // Since security isn't important for tests we can use fewer rounds
  bcryptRounds: 1,
});
