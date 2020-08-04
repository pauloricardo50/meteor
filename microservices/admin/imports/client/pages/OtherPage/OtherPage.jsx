import React from 'react';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BORROWERS_COLLECTION } from 'core/api/borrowers/borrowerConstants';
import { CONTACTS_COLLECTION } from 'core/api/contacts/contactsConstants';
import { INTEREST_RATES_COLLECTION } from 'core/api/interestRates/interestRatesConstants';
import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../startup/client/adminRoutes';
import BorrowersPage from '../BorrowersPage/loadable';
import ContactsPage from '../ContactsPage/loadable';
import InterestRatesPage from '../InterestRatesPage/loadable';
import PropertiesPage from '../PropertiesPage/loadable';
import WikiPage from '../WikiPage/loadable';

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
  {
    id: 'wiki',
    content: <WikiPage />,
    icon: (
      <FontAwesomeIcon icon={faQuestionCircle} className="collection-icon" />
    ),
    label: 'Wik-e-Potek',
  },
].map(({ icon, label, ...obj }) => ({
  ...obj,
  label: (
    <span className="other-page-label">
      <Icon type={icon || collectionIcons[obj.id]} />{' '}
      {label || <T id={`collections.${obj.id}`} />}
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
