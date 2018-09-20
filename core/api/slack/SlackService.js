import { Meteor } from 'meteor/meteor';
import isArray from 'lodash/isArray';

import colors from 'core/config/colors';

const LOGO_URL = 'http://d2gb1cl8lbi69k.cloudfront.net/E-Potek_icon_signature.jpg';
const shouldNotLog = Meteor.isDevelopment || Meteor.isTest || Meteor.isAppTest;

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

  sendError = (error, additionalData) =>
    this.sendAttachments({
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
        },
        {
          title: 'Stack',
          text: `\`\`\`${error.stack.toString()}\`\`\``,
          color: colors.error,
        },
        ...(additionalData
          ? [
            {
              title: 'Additional data',
              text: JSON.stringify(additionalData),
            },
          ]
          : []),
      ],
    });
}

export default new SlackService();
