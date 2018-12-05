import { Meteor } from 'meteor/meteor';
import isArray from 'lodash/isArray';

import colors from 'core/config/colors';
import UserService from '../users/UserService';
import { ROLES } from '../constants';

const LOGO_URL = 'http://d2gb1cl8lbi69k.cloudfront.net/E-Potek_icon_signature.jpg';
const shouldNotLog = Meteor.isDevelopment || Meteor.isAppTest || Meteor.isTest;
const ERRORS_TO_IGNORE = ['INVALID_STATE_ERR'];

export class SlackService {
  constructor({ serverSide }) {
    if (serverSide) {
      this.fetch = require('node-fetch');
    } else {
      // Fetch needs window context to function, or else you get this
      // https://stackoverflow.com/questions/9677985/uncaught-typeerror-illegal-invocation-in-chrome
      this.fetch = fetch.bind(window);
    }
  }

  send = ({
    channel = '#clients_general',
    username = 'e-Potek Bot',
    text,
    ...rest
  }) => {
    if (shouldNotLog) {
      return false;
    }

    return this.fetch(
      'https://hooks.slack.com/services/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',
      {
        method: 'POST',
        headers: {},
        body: JSON.stringify({
          channel,
          username,
          text: this.formatText(text),
          icon_url: LOGO_URL,
          mrkdwn: true,
          ...rest,
        }),
      },
    ).catch((err) => {
      // Somehow, this error is catched somewhere if we don't do this
      throw err;
    });
  };

  formatText = text => (isArray(text) ? text.join('\n') : text);

  sendAttachments = ({ attachments, ...rest }) =>
    this.send({
      attachments: attachments.map(this.formatAttachment),
      ...rest,
    });

  formatAttachment = ({ text, ...rest }) => ({
    text: this.formatText(text),
    mrkdwn_in: ['text', 'pretext'],
    ...rest,
  });

  sendError = ({ error, additionalData = [], userId }) => {
    if (
      ERRORS_TO_IGNORE.includes(error.name)
      || ERRORS_TO_IGNORE.includes(error.message || error.reason)
    ) {
      return false;
    }

    let user;
    let windowObj;

    try {
      // Can't use Meteor.user() outside of client or server-methods-body
      user = Meteor.user();
      // Can't access window on server
      windowObj = window;
    } catch (err) {
      user = null;
      windowObj = null;
    }

    if (!user && userId && Meteor.isServer) {
      user = UserService.findOne(userId);
    }

    return this.sendAttachments({
      channel: `errors-${Meteor.settings.public.environment}`,
      attachments: [
        {
          title: error.name,
          pretext: `Une erreur est arrivée sur *e-Potek ${
            Meteor.microservice
          }*`,
          text: error.message || error.reason,
          color: colors.error,
          footer: 'c la merde',
          ts: new Date().getTime(),
        },
        {
          title: 'Stack',
          text: `\`\`\`${error.stack && error.stack.toString()}\`\`\``,
          color: colors.error,
        },
        {
          title: 'User',
          text: `\`\`\`${JSON.stringify(user, null, 2)}\`\`\``,
          color: colors.primary,
        },
        {
          title: 'URL',
          text: windowObj && windowObj.location && windowObj.location.href,
          color: colors.primary,
        },
        {
          title: 'User agent',
          text:
            windowObj && windowObj.navigator && windowObj.navigator.userAgent,
          color: colors.primary,
        },
        ...(additionalData && additionalData.length > 0
          ? additionalData.map((data, index) => ({
            title: `Additional data ${index + 1}`,
            text: JSON.stringify(data),
          }))
          : []),
      ],
    });
  };

  getChannelForAdmin = admin =>
    (admin ? `#clients_${admin.email.split('@')[0]}` : '#clients_general');

  notifyAssignee = ({ currentUser, message, title, link }) => {
    const isUser = currentUser && currentUser.roles.includes(ROLES.USER);

    if (!isUser) {
      return false;
    }

    const admin = currentUser.assignedEmployee;
    const channel = this.getChannelForAdmin(admin);

    const slackPayload = {
      channel,
      attachments: [
        {
          title,
          title_link: link,
          text: message,
        },
      ],
    };

    if (Meteor.isStaging || Meteor.isDevelopment) {
      console.log('Slack dev/staging notification');
      console.log('Payload:', slackPayload);
      return slackPayload;
    }

    return this.sendAttachments(slackPayload);
  };

  notifyOfTask = (currentUser) => {
    this.notifyAssignee({
      currentUser,
      title: `Nouvelle tâche créée par ${currentUser && currentUser.name}`,
      link: Meteor.settings.public.subdomains.admin,
    });
  };

  notifyOfUpload = (currentUser, fileName) => {
    const isUser = currentUser && currentUser.roles.includes(ROLES.USER);

    if (!isUser) {
      return false;
    }

    const { name, loans } = currentUser;
    const loanNameEnd = loans.length === 1 ? ` pour ${loans[0].name}.` : '.';
    const title = `${name} a uploadé un nouveau document${loanNameEnd}`;
    const link = `${Meteor.settings.public.subdomains.admin}/users/${
      currentUser._id
    }`;

    this.notifyAssignee({ currentUser, message: fileName, title, link });
  };
}

export default new SlackService({ serverSide: Meteor.isServer });
