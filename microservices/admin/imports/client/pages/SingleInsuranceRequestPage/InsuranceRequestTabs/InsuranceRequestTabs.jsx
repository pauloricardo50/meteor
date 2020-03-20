import React from 'react';

import Tabs from 'core/components/Tabs';
import Icon from 'core/components/Icon';
import { createRoute } from 'core/utils/routerUtils';
import collectionIcons from 'core/arrays/collectionIcons';
import { REVENUES_COLLECTION } from 'core/api/constants';
import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';

import OverviewTab from './OverviewTab';
import InsuranceTab from './InsuranceTab';
import InsuranceAdder from './InsuranceTab/InsuranceAdder';
import BorrowersTab from './BorrowersTab';
import RevenuesTab from './RevenuesTab';

const getTabs = props => {
  const { insuranceRequest } = props;
  const { insurances = [], borrowers = [] } = insuranceRequest;
  return [
    {
      id: 'overview',
      content: <OverviewTab {...props} />,
      label: (
        <span className="single-insurance-request-page-tabs-label">
          <Icon type="info" className="mr-4" />
          <span>Général</span>
        </span>
      ),
      to:
        props.enableTabRouting &&
        createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
          insuranceRequestId: props.insuranceRequest._id,
          tabId: 'overview',
        }),
    },
    {
      id: 'borrowers',
      content: <BorrowersTab {...props} />,
      label: (
        <span className="single-insurance-request-page-tabs-label">
          <Icon type="people" className="mr-4" />
          <span>Assurés</span>
        </span>
      ),
      to:
        props.enableTabRouting &&
        createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
          insuranceRequestId: props.insuranceRequest._id,
          tabId: 'borrowers',
        }),
    },
    {
      id: 'revenues',
      content: <RevenuesTab {...props} />,
      label: (
        <span className="single-insurance-request-page-tabs-label">
          <Icon type={collectionIcons[REVENUES_COLLECTION]} className="mr-4" />
          <span>Revenus</span>
        </span>
      ),
      to:
        props.enableTabRouting &&
        createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
          insuranceRequestId: props.insuranceRequest._id,
          tabId: 'revenues',
        }),
    },
    ...insurances.map(insurance => {
      const { organisation, borrower } = insurance;
      const borrowerIndex = borrowers
        .map((b, i) => ({ ...b, index: i }))
        .find(({ _id }) => _id === borrower._id).index;

      return {
        id: insurance._id,
        content: <InsuranceTab {...props} insurance={insurance} />,
        label: (
          <span className="single-insurance-request-page-tabs-label">
            <img
              src={organisation.logo}
              alt={organisation.name}
              height={24}
              className="mr-8"
            />
            <div className="flex-col">
              <span>{insurance.name}</span>
              <span>{borrower.name || `Assuré ${borrowerIndex + 1}`}</span>
            </div>
          </span>
        ),
        to:
          props.enableTabRouting &&
          createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
            insuranceRequestId: props.insuranceRequest._id,
            tabId: insurance._id,
          }),
      };
    }),
    {
      id: 'insuranceAdder',
      content: null,
      label: <InsuranceAdder insuranceRequest={insuranceRequest} />,
    },
  ];
};

const InsuranceRequestTabs = ({ tabs, ...props }) => {
  const { enableTabRouting } = props;
  const formattedTabs = getTabs(props);

  return (
    <Tabs
      tabs={formattedTabs}
      routerParamName={enableTabRouting ? 'tabId' : undefined}
      variant="scrollable"
      scrollButtons="auto"
      disableTouchRipple
      className="single-insurance-request-page-tabs"
    />
  );
};

export default InsuranceRequestTabs;
