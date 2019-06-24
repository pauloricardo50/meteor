// @flow
import React, { Component } from 'react';

import Icon from 'core/components/Icon';
import StickyPopover from 'core/components/StickyPopover';
import { adminNotifications } from 'core/api/notifications/queries';
import NotificationsManagerContainer from './NotificationsManagerContainer';
import NotificationList from './NotificationList';

type NotificationsManagerProps = {};

class NotificationsManager extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  getData = () => {
    adminNotifications
      .clone({
        unread: true,
        $body: {
          recipientLinks: 1,
          task: { title: 1, dueAt: 1 },
          activity: { title: 1, date: 1 },
          relatedDoc: 1,
        },
      })
      .fetch((err, data) => {
        this.setState({ data });
      });
  };

  render() {
    const { unreadNotifications } = this.props;
    const { data } = this.state;

    return (
      <StickyPopover
        component={
          <NotificationList notifications={data} refetch={this.getData} />
        }
        placement="bottom"
        onMouseEnter={this.getData}
      >
        <div className="notifications-manager">
          <Icon
            type="notifications"
            badgeContent={unreadNotifications.length}
          />
        </div>
      </StickyPopover>
    );
  }
}

export default NotificationsManagerContainer(NotificationsManager);
