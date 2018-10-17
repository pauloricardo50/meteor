// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { compose, withState, withProps } from 'recompose';

import { sendPromotionInvitationEmail } from '../../../api';
import Button from '../../Button';

type EmailTesterProps = {};

const EmailTester = ({ send, sending }: EmailTesterProps) => (
  <Button raised primary onClick={send} disabled={sending}>
    Tester email d'invitation
  </Button>
);

export default compose(
  withState('sending', 'setSending', false),
  withProps(({ setSending, promotionId }) => ({
    send: () => {
      setSending(true);
      const user = Meteor.user();
      return sendPromotionInvitationEmail
        .run({
          userId: user._id,
          email: user.emails[0].address,
          isNewUser: false,
          promotionId,
          firstName: user.firstName,
        })
        .finally(() => setSending(false));
    },
  })),
)(EmailTester);
