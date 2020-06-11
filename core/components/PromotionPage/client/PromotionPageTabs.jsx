import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import cx from 'classnames';

import withMatchParam from '../../../containers/withMatchParam';
import { createRoute } from '../../../utils/routerUtils';
import Tabs from '../../Tabs';

const useStyles = makeStyles({ root: { backgroundColor: 'white' } });

const PromotionPageTabs = ({ promotion, route, tabId, tabs = [] }) => {
  const { _id: promotionId } = promotion;
  const classes = useStyles();

  return (
    <Tabs
      tabs={tabs.map(tab => ({
        ...tab,
        to: createRoute(route, { promotionId, tabId: tab.id }),
      }))}
      routerParamName="tabId"
      variant="fullWidth"
      tabsOnly
      tabsClassName={cx('promotion-page-tabs', classes.root)}
    />
  );
};

export default withMatchParam('tabId')(PromotionPageTabs);
