import { Meteor } from 'meteor/meteor';

import chalk from 'chalk';

import SlackService from '../../slack/server/SlackService';

class ErrorLogger {
  constructor() {
    this.enableLogging = Meteor.isDevelopment && !Meteor.isTest;
    this.sendToSlack = true;
  }

  handleError(params) {
    if (this.enableLogging) {
      this.logError(params);
    }

    if (this.sendToSlack) {
      return SlackService.sendError(params);
    }
  }

  logError({ error, additionalData, userId, url }) {
    console.error(
      chalk.yellow.inverse(
        '                 \n    ERROR LOG    \n                 \n',
      ),
    );
    console.error(chalk.yellowBright.bold('ERROR'));
    console.error(error);
    console.error('\n');

    console.error(chalk.yellowBright.bold('ADDITIONAL DATA'));
    console.error(additionalData);
    console.error('\n');

    console.error(chalk.yellowBright.bold('USER ID'));
    console.error(userId);
    console.error('\n');

    console.error(chalk.yellowBright.bold('URL'));
    console.error(url);
  }
}

export default new ErrorLogger();
