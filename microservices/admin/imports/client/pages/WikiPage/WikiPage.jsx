//      
import React from 'react';

import Tabs from 'core/components/Tabs';
import Icon from 'core/components/Icon';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import EmailList from './EmailList';

const tabs = [
  {
    id: 'emails',
    icon: 'mail',
    label: 'Emails automatiques',
    content: <EmailList />,
  },
].map(obj => ({
  ...obj,
  label: (
    <span className="other-page-label">
      <Icon type={obj.icon} /> {obj.label}
    </span>
  ),
  to: createRoute(ADMIN_ROUTES.WIKI_PAGE.path, { tabId: obj.id }),
}));

const WikiPage = () => (
  <div className="wiki-page">
    <Tabs tabs={tabs} routerParamName="tabId" />
  </div>
);

export default WikiPage;
