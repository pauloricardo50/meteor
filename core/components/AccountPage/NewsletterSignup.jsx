import React from 'react';

import { MAILCHIMP_LIST_STATUS } from '../../api/email/emailConstants';
import { updateNewsletterProfile } from '../../api/email/methodDefinitions';
import { appUser } from '../../api/users/queries';
import { USERS_COLLECTION } from '../../api/users/userConstants';
import { useStaticMeteorData } from '../../hooks/useMeteorData';
import Checkbox from '../Checkbox';
import T from '../Translation';

const NewsletterSignup = ({
  userId,
  label = (
    <T defaultMessage="Recevoir notre newsletter mensuelle avec les dernières actualités du monde hypothécaire" />
  ),
}) => {
  const { data, loading } = useStaticMeteorData({
    query: userId ? USERS_COLLECTION : appUser,
    params: userId
      ? { $filters: { _id: userId }, newsletterStatus: 1 }
      : { $body: { newsletterStatus: 1 } },
    type: 'single',
  });

  return (
    <Checkbox
      onChange={() =>
        updateNewsletterProfile.run({
          userId: data?._id,
          status:
            data?.newsletterStatus?.status === MAILCHIMP_LIST_STATUS.SUBSCRIBED
              ? MAILCHIMP_LIST_STATUS.UNSUBSCRIBED
              : MAILCHIMP_LIST_STATUS.SUBSCRIBED,
        })
      }
      value={
        data?.newsletterStatus?.status === MAILCHIMP_LIST_STATUS.SUBSCRIBED
      }
      label={label}
      disabled={loading}
    />
  );
};

export default NewsletterSignup;
