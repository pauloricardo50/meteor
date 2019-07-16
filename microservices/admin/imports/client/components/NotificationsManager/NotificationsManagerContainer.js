import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import { adminNotifications } from 'core/api/notifications/queries';

export default compose(withSmartQuery({
  query: adminNotifications,
  queryOptions: { reactive: true },
  params: { unread: true, $body: { _id: 1 } },
  dataName: 'unreadNotifications',
  smallLoader: true,
}));
