import { Meteor } from 'meteor/meteor';
import isArray from 'lodash/isArray';
import fetch from 'node-fetch';

import colors from 'core/config/colors';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../constants';
import fullLoan from '../../loans/queries/fullLoan';
import Calculator from '../../../utils/Calculator';
import { percentFormatters } from '../../../utils/formHelpers';

const LOGO_URL = 'http://d2gb1cl8lbi69k.cloudfront.net/E-Potek_icon_signature.jpg';
const shouldNotLog = Meteor.isDevelopment || Meteor.isAppTest || Meteor.isTest;
const ERRORS_TO_IGNORE = ['INVALID_STATE_ERR'];

export class SlackService {
  send = ({
    channel = '#clients_general',
    username = 'e-Potek Bot',
    text,
    ...rest
  }) => {
    const body = {
      channel,
      username,
      text: this.formatText(text),
      icon_url: LOGO_URL,
      mrkdwn: true,
      ...rest,
    };

    if (shouldNotLog) {
      return Promise.resolve(body);
    }

    return fetch(
      'https://hooks.slack.com/services/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',
      {
        method: 'POST',
        headers: {},
        body: JSON.stringify(body),
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

  sendError = ({ error, additionalData = [], userId, url }) => {
    if (Meteor.isDevelopment && !Meteor.isTest) {
      console.log('error', error);
      console.log('additionalData', additionalData);
      console.log('userId', userId);
      console.log('url', url);
    }

    if (
      (error && ERRORS_TO_IGNORE.includes(error.name))
      || ERRORS_TO_IGNORE.includes(error.message || error.reason)
    ) {
      return false;
    }

    let user;

    try {
      // Can't use Meteor.user() outside of client or server-methods-body
      user = Meteor.user();
      // Can't access window on server
    } catch (err) {
      user = null;
    }

    if (!user && userId) {
      user = UserService.get(userId);
    }

    return this.sendAttachments({
      channel: `errors-${Meteor.settings.public.environment}`,
      username: user ? user.name : undefined,
      attachments: [
        {
          title: error && error.name,
          pretext: `Une erreur est arrivée sur *e-Potek ${
            Meteor.microservice
          }*`,
          text: error && (error.message || error.reason),
          color: colors.error,
          footer: 'c la merde',
          ts: new Date() / 1000,
        },
        {
          title: 'Stack',
          text: error && `\`\`\`${error.stack && error.stack.toString()}\`\`\``,
          color: colors.error,
        },
        {
          title: 'User',
          text: `\`\`\`${JSON.stringify(user, null, 2)}\`\`\``,
          color: colors.primary,
        },
        {
          title: 'URL',
          text: url,
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

  notifyAssignee = ({
    currentUser,
    message,
    title,
    link,
    assignee,
    notifyAlways,
  }) => {
    const isAdmin = currentUser
      && (currentUser.roles.includes(ROLES.ADMIN)
        || currentUser.roles.includes(ROLES.DEV));

    if (!notifyAlways && isAdmin) {
      return false;
    }

    const admin = assignee || (currentUser && currentUser.assignedEmployee);
    const channel = this.getChannelForAdmin(admin);

    const slackPayload = {
      channel,
      attachments: [{ title, title_link: link, text: message }],
      username: currentUser ? currentUser.name : undefined,
    };

    if ((Meteor.isStaging || Meteor.isDevelopment) && !Meteor.isTest) {
      console.log('Slack dev/staging notification');
      console.log('Payload:', slackPayload);
      return slackPayload;
    }

    return this.sendAttachments(slackPayload);
  };

  notifyOfUpload = ({ currentUser, fileName, docLabel, loanId }) => {
    const isUser = currentUser && currentUser.roles.includes(ROLES.USER);

    if (!isUser) {
      return false;
    }

    const loan = loanId && fullLoan.clone({ _id: loanId }).fetchOne();
    const loanNameEnd = loan ? ` pour ${loan.name}.` : '.';
    const title = `Upload: ${fileName} dans ${docLabel}${loanNameEnd}`;
    let link = `${Meteor.settings.public.subdomains.admin}/users/${
      currentUser._id
    }`;
    let message = '';

    if (loan) {
      const infoProgress = Calculator.personalInfoPercent({ loan });
      const propertyProgress = Calculator.propertyPercent({ loan });
      const documentsProgress = Calculator.filesProgress({
        loan,
      }).percent;

      const progressParts = [
        `Emprunteurs \`${percentFormatters.format(infoProgress)}%\``,
        `Documents: \`${percentFormatters.format(documentsProgress)}%\``,
        `Bien immo: \`${percentFormatters.format(propertyProgress)}%\``,
      ];

      if (loan.hasPromotion) {
        message = `_Promotion: \`${loan.promotions[0].name}\`_ `;
        progressParts.pop(); // Remove property progress in case of a promotion
      }

      message += `*Progrès:* ${progressParts.join(', ')}`;
      link = `${Meteor.settings.public.subdomains.admin}/loans/${loan._id}`;
    }

    return this.notifyAssignee({ currentUser, message, title, link });
  };
}

export default new SlackService({ serverSide: Meteor.isServer });
