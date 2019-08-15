// @flow
import React, { useState, useContext } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import Link from 'core/components/Link/Link';
import { createRoute } from 'core/utils/routerUtils';
import T from '../../Translation';
import PromotionMetadataContext from './PromotionMetadata';

type PromotionPageTabsProps = {};

const useStyles = makeStyles({ root: { backgroundColor: 'white' } });

const getTabs = ({
  canSeeCustomers,
  canSeeUsers,
  promotion: { users = [], loans = [], documents },
}) =>
  [
    { id: 'overview', shouldDisplay: true },
    { id: 'map', shouldDisplay: true },
    {
      id: 'partners',
      shouldDisplay: documents && documents.logos && documents.logos.length > 0,
    },
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

const PromotionPageTabs = ({ promotion }: PromotionPageTabsProps) => {
  const { _id: promotionId, users, loans } = promotion;
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const {
    permissions: { canSeeCustomers, canSeeUsers },
  } = useContext(PromotionMetadataContext);

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
      {getTabs({ canSeeCustomers, canSeeUsers, promotion }).map(({ id, label }) => (
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
