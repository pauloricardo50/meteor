import React, { useState } from 'react';

import { NOTIFICATIONS_COLLECTION } from 'core/api/notifications/notificationConstants';
import { createQuery } from 'core/api/queries';
import Icon from 'core/components/Icon';
import StickyPopover from 'core/components/StickyPopover';
import useCurrentUser from 'core/hooks/useCurrentUser';
import useMeteorData from 'core/hooks/useMeteorData';

import NotificationList from './NotificationList';

const unreadFilters = currentUserId => ({
  recipientLinks: {
    $elemMatch: {
      _id: currentUserId,
      read: false,
      $or: [
        { snoozeDate: { $exists: false } },
        { snoozeDate: { $lte: new Date() } },
      ],
    },
  },
});

const NotificationsManager = () => {
  const currentUser = useCurrentUser();
  const { data: count } = useMeteorData(
    {
      query: NOTIFICATIONS_COLLECTION,
      params: { $filters: unreadFilters(currentUser?._id) },
      type: 'count',
    },
    [currentUser?._id],
  );
  const [data, setData] = useState(null);

  const getData = () => {
    createQuery({
      notifications: {
        $filters: unreadFilters(currentUser?._id),
        recipientLinks: 1,
        title: 1,
        relatedDoc: 1,
        createdAt: 1,
      },
    }).fetch((err, result) => setData(result));
  };

  return (
    <StickyPopover
      component={<NotificationList notifications={data} refetch={getData} />}
      placement="bottom"
      onMouseEnter={getData}
    >
      <div className="notifications-manager">
        <Icon type="notifications" badgeContent={count} />
      </div>
    </StickyPopover>
  );
};

export default NotificationsManager;
