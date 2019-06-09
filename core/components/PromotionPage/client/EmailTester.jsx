// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withState, withProps } from 'recompose';

import { sendPromotionInvitationEmail } from '../../../api';
import Button from '../../Button';

type EmailTesterProps = {};

const EmailTester = ({ send, sending }: EmailTesterProps) => (
  <Button raised primary onClick={send} loading={sending}>
    Tester email d'invitation
  </Button>
);

export default compose(
  withState('sending', 'setSending', false),
  withProps(({ setSending, promotionId }) => ({
    send: () => {
      setSending(true);
      const user = Meteor.user();
      const email = user.emails[0].address;
      return sendPromotionInvitationEmail
        .run({
          userId: user._id,
          email,
          isNewUser: false,
          promotionId,
          firstName: user.firstName,
        })
        .then(() => {
          import('../../../utils/message').then(({ default: message }) => {
            message.success(`Email test envoyé à ${email}`, 5);
          });
        })
        .finally(() => setSending(false));
    },
  })),
)(EmailTester);
