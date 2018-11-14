// @flow
import React from 'react';

import Tabs from 'core/components/Tabs';
import SinglePromotionTab from './SinglePromotionTab';

type PromotionsTabProps = {};

const PromotionsTab = (props: PromotionsTabProps) => {
  const { loan } = props;

  return (
    <Tabs
      tabs={loan.promotions.map(promotiomn => ({
        id: promotiomn._id,
        label: promotiomn.name,
        content: (
          <SinglePromotionTab
            {...props}
            promotion={promotiomn}
            key={promotiomn._id}
          />
        ),
      }))}
    />
  );
};

export default PromotionsTab;
