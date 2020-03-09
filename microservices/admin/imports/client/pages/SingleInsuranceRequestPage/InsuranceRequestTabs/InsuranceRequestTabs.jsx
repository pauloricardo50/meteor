import React from 'react';
import { lifecycle } from 'recompose';

import Tabs from 'core/components/Tabs';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from '../../../../startup/client/adminRoutes';

import OverviewTab from './OverviewTab';

const getTabs = props => {
  const { insuranceRequest } = props;

  return [
    {
      id: 'overview',
      Component: OverviewTab,
      icon: 'info',
    },
  ];
};

const formatTabs = (tabs, props) =>
  tabs
    .filter(x => x)
    .map(({ id, Component, style = {}, additionalLabel, icon = 'help' }) => ({
      id,
      content: <Component {...props} />,
      label: (
        <span
          style={style}
          className="single-insurance-request-page-tabs-label"
        >
          <Icon type={icon} className="mr-4" />
          <T id={`InsuranceRequestTabs.${id}`} noTooltips />
          {additionalLabel && <>&nbsp;&bull;&nbsp; {additionalLabel}</>}
        </span>
      ),
      to:
        props.enableTabRouting &&
        createRoute(ADMIN_ROUTES.SINGLE_INSURANCE_REQUEST_PAGE.path, {
          insuranceRequestId: props.insuranceRequest._id,
          tabId: id,
        }),
    }));

const InsuranceRequestTabs = ({ tabs, ...props }) => {
  const { enableTabRouting } = props;
  const formattedTabs = formatTabs(tabs || getTabs(props), props);
  console.log('formattedTabs:', formattedTabs);

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
