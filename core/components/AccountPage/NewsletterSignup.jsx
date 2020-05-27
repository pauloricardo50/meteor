import React from 'react';

import { MANDRILL_LIST_STATUS } from '../../api/email/emailConstants';
import { updateMailchimpProfile } from '../../api/email/methodDefinitions';
import { appUser } from '../../api/users/queries';
import { USERS_COLLECTION } from '../../api/users/userConstants';
import { useStaticMeteorData } from '../../hooks/useMeteorData';
import Checkbox from '../Checkbox';
import T from '../Translation';

const NewsletterSignup = ({ userId }) => {
  const { data, loading } = useStaticMeteorData({
    query: userId ? USERS_COLLECTION : appUser,
    params: userId
      ? { $filters: { _id: userId }, newsletterStatus: 1 }
      : { $body: { newsletterStatus: 1 } },
    type: 'single',
  });

  return (
    <div>
      <h4>
        <T id="AccountPage.newsletter" />
      </h4>
      <Checkbox
        onChange={() =>
          updateMailchimpProfile.run({
            userId: data?._id,
            status:
              data?.newsletterStatus?.status === MANDRILL_LIST_STATUS.SUBSCRIBED
                ? MANDRILL_LIST_STATUS.UNSUBSCRIBED
                : MANDRILL_LIST_STATUS.SUBSCRIBED,
          })
        }
        value={
          data?.newsletterStatus?.status === MANDRILL_LIST_STATUS.SUBSCRIBED
        }
        label={<T id="AccountPage.newsletter.signedUp" />}
        disabled={loading}
      />
    </div>
  );
};

export default NewsletterSignup;
