// @flow
import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'core/components/Link/Link';
import { createRoute } from 'core/utils/routerUtils';
import withMatchParam from 'core/containers/withMatchParam';
import T from '../../Translation';

type PromotionPageTabsProps = {};

const useStyles = makeStyles({ root: { backgroundColor: 'white' } });

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
  tabs = [],
}: PromotionPageTabsProps) => {
  const { _id: promotionId, users, loans } = promotion;
  const classes = useStyles();
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
