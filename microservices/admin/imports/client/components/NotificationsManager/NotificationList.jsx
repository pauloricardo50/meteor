//
import React from 'react';
import moment from 'moment';

import Loading from 'core/components/Loading';
import { CollectionIconLink } from 'core/components/IconLink';
import IconButton from 'core/components/IconButton';
import {
  readNotification,
  snoozeNotification,
} from 'core/api/notifications/methodDefinitions';

const getNotificationTitle = (title, createdAt) => (
  <>
    <p className="secondary" style={{ margin: 0 }}>
      {moment(createdAt).fromNow()}
      :&nbsp;
    </p>
    <p style={{ margin: 0 }}>{title}</p>
  </>
);

const Notification = ({
  _id: notificationId,
  title,
  refetch,
  relatedDoc,
  createdAt,
}) => (
  <div className="notification-list-item">
    <div>
      <div className="flex-row">{getNotificationTitle(title, createdAt)}</div>
      {relatedDoc && <CollectionIconLink relatedDoc={relatedDoc} />}
    </div>
    <div className="buttons">
      <IconButton
        onClick={() => readNotification.run({ notificationId }).then(refetch)}
        size="small"
        type="check"
        tooltip="Marquer comme lu"
        className="success"
      />
      <IconButton
        onClick={() => snoozeNotification.run({ notificationId }).then(refetch)}
        size="small"
        type="snooze"
        tooltip="Me rappeler dans 1h"
        className="primary"
      />
    </div>
  </div>
);

const NotificationList = ({ notifications, refetch }) => {
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
      {notifications.map((notification, i) => [
        i !== 0 && <hr />,
        <Notification
          key={notification._id}
          {...notification}
          refetch={refetch}
        />,
      ])}
    </div>
  );
};

export default NotificationList;
