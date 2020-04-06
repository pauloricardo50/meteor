import { Meteor } from 'meteor/meteor';

import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import fetch from 'node-fetch';

import colors from '../../../config/colors';
import Calculator from '../../../utils/Calculator';
import { percentFormatters } from '../../../utils/formHelpers';
import { getClientMicroservice } from '../../../utils/server/getClientUrl';
import { fullLoan } from '../../loans/queries';
import LoanService from '../../loans/server/LoanService';
import { getAPIUser } from '../../RESTAPI/server/helpers';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';

const LOGO_URL =
  'http://d2gb1cl8lbi69k.cloudfront.net/E-Potek_icon_signature.jpg';
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
    ).catch(err => {
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

  sendError = ({ error, additionalData = [], userId, url, connection }) => {
    if (Meteor.isDevelopment && !Meteor.isTest) {
      console.log('error', error);
      console.log('additionalData', additionalData);
      console.log('userId', userId);
      console.log('url', url);
    }

    if (
      (error && ERRORS_TO_IGNORE.includes(error.name)) ||
      ERRORS_TO_IGNORE.includes(error.message || error.reason)
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
      user = UserService.get(userId, {
        name: 1,
        roles: 1,
        organisations: { name: 1 },
      });
    }

    const attachments = [
      {
        title: error && error.name,
        pretext: `Une erreur est arrivée sur *e-Potek ${getClientMicroservice()}*`,
        text: error && (error.message || error.reason),
        color: colors.error,
        footer: 'c la merde',
        ts: new Date() / 1000,
      },
      {
        title: 'Stack',
        text: error && `\`\`\`${error?.stack?.toString()}\`\`\``,
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
    ];

    if (additionalData.length > 0) {
      attachments.push(
        ...additionalData.map((data, index) => ({
          title: `Additional data ${index + 1}`,
          text: JSON.stringify(data),
        })),
      );
    }

    if (connection) {
      attachments.push({
        title: 'Connection',
        text: `\`\`\`${JSON.stringify(
          pick(connection, ['clientAdress', 'httpHeaders']),
          null,
          2,
        )}\`\`\``,
      });
    }

    return this.sendAttachments({
      channel: `errors-${Meteor.settings.public.environment}`,
      username: this.getNotificationOrigin(user),
      attachments,
    });
  };

  getChannelForAdmin = admin =>
    admin ? `#clients_${admin.email.split('@')[0]}` : '#clients_general';

  notifyAssignee = ({
    currentUser,
    message,
    title,
    link,
    assignee,
    notifyAlways,
    loanId,
  }) => {
    const isAdmin =
      currentUser &&
      (currentUser.roles.includes(ROLES.ADMIN) ||
        currentUser.roles.includes(ROLES.DEV));

    if (!notifyAlways && isAdmin) {
      return false;
    }

    const admin = this.getAssigneeForMessage({ assignee, currentUser, loanId });
    const channel = this.getChannelForAdmin(admin);

    const slackPayload = {
      channel,
      attachments: [{ title, title_link: link, text: message }],
      username: this.getNotificationOrigin(currentUser),
    };

    if (
      (Meteor.isStaging || Meteor.isDevEnvironment || Meteor.isDevelopment) &&
      !Meteor.isTest
    ) {
      console.log('Slack dev/staging notification');
      console.log('Payload:', slackPayload);
      return slackPayload;
    }

    return this.sendAttachments(slackPayload);
  };

  getAssigneeForMessage({ currentUser, assignee, loanId }) {
    if (assignee) {
      return assignee;
    }

    if (loanId) {
      return LoanService.getMainAssignee({ loanId });
    }

    return currentUser?.assignedEmployee;
  }

  getNotificationOrigin = currentUser => {
    const APIUser = getAPIUser();
    const username = currentUser?.name;
    const isPro = currentUser?.roles.includes(ROLES.PRO);

    if (APIUser) {
      const mainOrg =
        UserService.getUserMainOrganisation(APIUser._id) ||
        (APIUser.organisations?.length && APIUser.organisations[0].name);
      const proOrg =
        (currentUser && UserService.getUserMainOrganisation(currentUser._id)) ||
        (APIUser.organisations?.length && APIUser.organisations[0].name);
      return [
        username || APIUser.name,
        `(${proOrg && proOrg.name}, API ${mainOrg && mainOrg.name})`,
      ].join(' ');
    }

    if (isPro) {
      const mainOrg = UserService.getUserMainOrganisation(currentUser._id);
      return [username, `(${mainOrg && mainOrg.name})`].join(' ');
    }

    if (currentUser) {
      const {
        user: { name: referralUser } = {},
        organisation: { name: referralOrg } = {},
      } = UserService.getReferral(currentUser._id);
      const referral = referralUser
        ? `(ref ${referralUser} - ${referralOrg})`
        : referralOrg
        ? `(ref ${referralOrg})`
        : undefined;
      return [username, referral].filter(x => x).join(' ');
    }

    return username;
  };

  notifyOfUpload = ({ currentUser, fileName, docLabel, loanId }) => {
    const isUser = currentUser && currentUser.roles.includes(ROLES.USER);

    if (!isUser) {
      return false;
    }

    const loan = loanId && fullLoan.clone({ _id: loanId }).fetchOne();
    const loanNameEnd = loan ? ` pour ${loan.name}.` : '.';
    const title = `Upload: ${fileName} dans ${docLabel}${loanNameEnd}`;
    let link = `${Meteor.settings.public.subdomains.admin}/users/${currentUser._id}`;
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

    return this.notifyAssignee({ currentUser, message, title, link, loanId });
  };
}

export default new SlackService({ serverSide: Meteor.isServer });
