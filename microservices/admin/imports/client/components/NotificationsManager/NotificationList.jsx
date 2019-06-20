// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';

import Loading from 'core/components/Loading';
import IconButton from 'core/components/IconButton';
import {
  readNotification,
  snoozeNotification,
} from 'core/api/notifications/methodDefinitions';

type NotificationListProps = {};

const getNotificationTitle = (task, activity) => {
  if (task) {
    return task.title;
  }
  if (activity) {
    return activity.title;
  }

  return "L'orgine de la notification a été supprimé";
};

const Notification = ({
  _id: notificationId,
  task,
  activity,
  recipientLinks,
  refetch,
}) => {
  const recipient = recipientLinks.find(({ _id }) => _id === Meteor.userId());
  return (
    <div className="notification-list-item">
      <div>{getNotificationTitle(task, activity)}</div>
      <div className="buttons">
        <IconButton
          onClick={() => readNotification.run({ notificationId }).then(refetch)}
          size="small"
          type="check"
          tooltip="Marquer comme lu"
          className="success"
        />
        <IconButton
          onClick={() =>
            snoozeNotification.run({ notificationId }).then(refetch)
          }
          size="small"
          type="snooze"
          tooltip="Me rappeler dans 1h"
          className="primary"
        />
      </div>
    </div>
  );
};

const NotificationList = ({
  notifications,
  refetch,
}: NotificationListProps) => {
  console.log('notifications:', notifications);
  if (!notifications) {
    return <Loading />;
  }

  if (notifications.length === 0) {
    return (
      <div className="notification-list">
        <h4 className="secondary text-center">
          Pas de notifications pour l'instant
        </h4>
      </div>
    );
  }

  return (
    <div className="notification-list">
      {notifications.map(notification => (
        <Notification
          key={notification._id}
          {...notification}
          refetch={refetch}
        />
      ))}
    </div>
  );
};

export default NotificationList;
