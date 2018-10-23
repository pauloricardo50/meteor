import { Meteor } from 'meteor/meteor';
import isArray from 'lodash/isArray';

import colors from 'core/config/colors';
import { ROLES } from '../users/userConstants';

const LOGO_URL = 'http://d2gb1cl8lbi69k.cloudfront.net/E-Potek_icon_signature.jpg';
const shouldNotLog = Meteor.isDevelopment || Meteor.isTest || Meteor.isAppTest;
const ERRORS_TO_IGNORE = ['INVALID_STATE_ERR'];

class SlackService {
  send = ({ channel, username = 'e-Potek Bot', text, ...rest }) => {
    if (shouldNotLog) {
      return false;
    }

    return fetch(
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
    ).catch(this.catchError(text));
  };

  catchError = text => error =>
    this.sendError(error, `Tried to send text: ${text}`).catch(err2 =>
      console.log(('Slack error:', err2)));

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

  sendError = (error, ...additionalData) => {
    if (ERRORS_TO_IGNORE.includes(error.message || error.reason)) {
      return false;
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
          ts: new Date(),
        },
        {
          title: 'Stack',
          text: `\`\`\`${error.stack.toString()}\`\`\``,
          color: colors.error,
        },
        {
          title: 'User',
          text: `\`\`\`${JSON.stringify(Meteor.user(), null, 2)}\`\`\``,
          color: colors.primary,
        },
        {
          title: 'URL',
          text: window.location && window.location.href,
          color: colors.primary,
        },
        {
          title: 'User agent',
          text: window.navigator && window.navigator.userAgent,
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
      title: `Nouvelle tâche créée par ${currentUser.name}`,
      link: Meteor.settings.public.subdomains.admin,
    });
  };

  notifyOfUpload = (currentUser, fileName) => {
    const { name, loans } = currentUser;
    const loanNameEnd = loans.length === 1 ? ` pour ${loans[0].name}.` : '.';
    const title = `${name} a uploadé un nouveau document${loanNameEnd}`;
    const link = `${Meteor.settings.public.subdomains.admin}/users/${
      currentUser._id
    }`;

    this.notifyAssignee({ currentUser, message: fileName, title, link });
  };
}

export default new SlackService();
