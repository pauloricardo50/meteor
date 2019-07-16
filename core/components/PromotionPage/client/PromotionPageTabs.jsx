// @flow
import React, { useState, useContext } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'core/components/Link/Link';
import { createRoute } from 'core/utils/routerUtils';
import T from '../../Translation';
import PromotionPermissionsContext from './PromotionPermissions';

type PromotionPageTabsProps = {};

const useStyles = makeStyles({
  root: {
    backgroundColor: 'white',
  },
});

const getTabs = ({ canSeeCustomers, canSeeUsers, users = [], loans = [] }) =>
  [
    {
      id: 'overview',
      shouldDisplay: true,
      label: <T id="PromotionPageTabs.overview" />,
    },
    {
      id: 'partners',
      shouldDisplay: true,
      label: <T id="PromotionPageTabs.partners" />,
    },
    {
      id: 'files',
      shouldDisplay: true,
      label: <T id="PromotionPageTabs.files" />,
    },
    {
      id: 'customers',
      shouldDisplay: canSeeCustomers,
      label: (
        <T id="PromotionPageTabs.customers" values={{ count: loans.length }} />
      ),
    },
    {
      id: 'users',
      shouldDisplay: canSeeUsers,
      label: (
        <T id="PromotionPageTabs.users" values={{ count: users.length }} />
      ),
    },
  ].filter(({ shouldDisplay }) => shouldDisplay);

const PromotionPageTabs = ({ promotion }: PromotionPageTabsProps) => {
  const { _id: promotionId, users, loans } = promotion;
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { canSeeCustomers, canSeeUsers } = useContext(PromotionPermissionsContext);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      className={classes.root}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      {getTabs({ canSeeCustomers, canSeeUsers, users, loans }).map(({ id, label }) => (
        <Tab
          key={id}
          label={label}
          component={Link}
          to={createRoute('/promotions/:promotionId/:tabId', {
            promotionId,
            tabId: id,
          })}
        />
      ))}
    </Tabs>
  );
};

export default PromotionPageTabs;
