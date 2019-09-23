// @flow
import React, { useState, useContext } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'core/components/Link/Link';
import { createRoute } from 'core/utils/routerUtils';
import withMatchParam from 'core/containers/withMatchParam';
import T from '../../Translation';
import PromotionMetadataContext from './PromotionMetadata';

type PromotionPageTabsProps = {};

const useStyles = makeStyles({ root: { backgroundColor: 'white' } });

const getTabs = ({
  permissions: { canSeeCustomers, canSeeUsers, canSeeManagement },
  promotion: { users = [], loans = [], documents },
}) =>
  [
    { id: 'management', shouldDisplay: canSeeManagement },
    { id: 'overview', shouldDisplay: true },
    { id: 'map', shouldDisplay: true },
    { id: 'partners', shouldDisplay: true },
    {
      id: 'files',
      shouldDisplay:
        documents
        && documents.promotionDocuments
        && documents.promotionDocuments.length > 0,
    },
    {
      id: 'customers',
      label: (
        <T id="PromotionPageTabs.customers" values={{ count: loans.length }} />
      ),
      shouldDisplay: canSeeCustomers,
    },
    {
      id: 'users',
      label: (
        <T id="PromotionPageTabs.users" values={{ count: users.length }} />
      ),
      shouldDisplay: canSeeUsers,
    },
  ]
    .filter(({ shouldDisplay }) => shouldDisplay)
    .map(tab => ({
      ...tab,
      label: tab.label || <T id={`PromotionPageTabs.${tab.id}`} />,
    }));

const getInitialTab = (tabs, tabId) => {
  const index = tabs.findIndex(({ id }) => id === tabId);

  if (index < 0) {
    return tabs.findIndex(({ id }) => id === 'management' || id === 'overview');
  }

  return index;
};

const PromotionPageTabs = ({
  promotion,
  route,
  tabId,
}: PromotionPageTabsProps) => {
  const { _id: promotionId, users, loans } = promotion;
  const classes = useStyles();
  const { permissions } = useContext(PromotionMetadataContext);
  const tabs = getTabs({ promotion, permissions });
  const [value, setValue] = useState(getInitialTab(tabs, tabId));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      className={classes.root}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      {tabs.map(({ id, label }) => (
        <Tab
          key={id}
          label={label}
          component={Link}
          to={createRoute(route, { promotionId, tabId: id })}
        />
      ))}
    </Tabs>
  );
};

export default withMatchParam('tabId')(PromotionPageTabs);
