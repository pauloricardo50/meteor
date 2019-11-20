// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import {
  BORROWERS_COLLECTION,
  INTEREST_RATES_COLLECTION,
  PROPERTIES_COLLECTION,
  TASKS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import collectionIcons from 'core/arrays/collectionIcons';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import TasksPage from '../TasksPage/loadable';
import BorrowersPage from '../BorrowersPage/loadable';
import PropertiesPage from '../PropertiesPage/loadable';
import InterestRatesPage from '../InterestRatesPage/loadable';
import ContactsPage from '../ContactsPage/loadable';
import EmailList from './EmailList';

type OtherPageProps = {};

const tabs = [
  {
    id: INTEREST_RATES_COLLECTION,
    content: <InterestRatesPage />,
  },
  { id: TASKS_COLLECTION, content: <TasksPage /> },
  {
    id: BORROWERS_COLLECTION,
    content: <BorrowersPage />,
  },
  {
    id: PROPERTIES_COLLECTION,
    content: <PropertiesPage />,
  },
  {
    id: CONTACTS_COLLECTION,
    content: <ContactsPage />,
  },
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
      <Icon type={obj.icon || collectionIcons[obj.id]} />{' '}
      {obj.label || <T id={`collections.${obj.id}`} />}
    </span>
  ),
  to: createRoute(ADMIN_ROUTES.OTHER_PAGE.path, { tabId: obj.id }),
}));

const OtherPage = (props: OtherPageProps) => (
  <div className="other-page">
    <Tabs tabs={tabs} routerParamName="tabId" />
  </div>
);

export default OtherPage;
