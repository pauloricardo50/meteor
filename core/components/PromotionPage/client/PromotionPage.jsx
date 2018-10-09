// @flow
import React from 'react';

import T from '../../Translation';
import Button from '../../Button';
import PromotionPageHeader from './PromotionPageHeader';
import PromotionLotsTable from './PromotionLotsTable';

type PromotionPageProps = {};

const PromotionPage = (props: PromotionPageProps) => (
  <div className="card1 promotion-page">
    <PromotionPageHeader {...props} />
    <div className="add-customer flex center">
      <Button raised primary>
        <T id="PromotionPage.addCustomer" />
      </Button>
    </div>
    <PromotionLotsTable promotion={props.promotion} />
  </div>
);

export default PromotionPage;
