import React from 'react';

import Tabs from 'core/components/Tabs';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import {
  BORROWERS_COLLECTION,
  INTEREST_RATES_COLLECTION,
  PROPERTIES_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';
import collectionIcons from 'core/arrays/collectionIcons';
import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import BorrowersPage from '../BorrowersPage/loadable';
import PropertiesPage from '../PropertiesPage/loadable';
import InterestRatesPage from '../InterestRatesPage/loadable';
import ContactsPage from '../ContactsPage/loadable';

const tabs = [
  {
    id: INTEREST_RATES_COLLECTION,
    content: <InterestRatesPage />,
  },
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
].map(obj => ({
  ...obj,
  label: (
    <span className="other-page-label">
      <Icon type={collectionIcons[obj.id]} />{' '}
      {<T id={`collections.${obj.id}`} />}
    </span>
  ),
  to: createRoute(ADMIN_ROUTES.OTHER_PAGE.path, { tabId: obj.id }),
}));

const OtherPage = () => (
  <div className="other-page">
    <Tabs tabs={tabs} routerParamName="tabId" />
  </div>
);

export default OtherPage;
