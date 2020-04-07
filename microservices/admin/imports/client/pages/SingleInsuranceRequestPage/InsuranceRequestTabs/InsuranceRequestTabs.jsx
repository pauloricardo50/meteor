import React from 'react';
import { faFolderOpen } from '@fortawesome/pro-light-svg-icons/faFolderOpen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import Tabs from 'core/components/Tabs';
import { createRoute } from 'core/utils/routerUtils';

import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';
import BorrowersTab from './BorrowersTab';
import InsuranceRequestFileTabs from './InsuranceRequestFileTabs';
import InsuranceTab from './InsuranceTab';
import InsuranceAdder from './InsuranceTab/InsuranceAdder';
import OverviewTab from './OverviewTab';
import RevenuesTab from './RevenuesTab';

const getTabs = props => {
  const { insuranceRequest = {} } = props;
  console.log('insuranceRequest:', insuranceRequest);
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
    {
      id: 'files',
      content: <InsuranceRequestFileTabs {...props} />,
      label: (
        <span className="single-insurance-request-page-tabs-label">
          <FontAwesomeIcon icon={faFolderOpen} className="mr-4" />
          <span>Documents</span>
        </span>
      ),
      to:
        props.enableTabRouting &&
        createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
          insuranceRequestId: props.insuranceRequest._id,
          tabId: 'files',
        }),
    },
    ...insurances.map(insurance => {
      const {
        organisation,
        borrower,
        insuranceProduct: { name },
      } = insurance;
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
              <span>{borrower.name || `Assuré ${borrowerIndex + 1}`}</span>
              <span>{name}</span>
            </div>
          </span>
        ),
        to:
          props.enableTabRouting &&
          createRoute(
            ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE_INSURANCES.path,
            {
              insuranceRequestId: props.insuranceRequest._id,
              tabId: insurance._id,
            },
          ),
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
