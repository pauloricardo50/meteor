// @flow
import React from 'react';

import T from '../../Translation';
import Button from '../../Button';
import PromotionPageHeader from './PromotionPageHeader';
import PromotionLotsTable from './PromotionLotsTable';
import PromotionDocumentsManager from './PromotionDocumentsManager';

type PromotionPageProps = {};

const PromotionPage = (props: PromotionPageProps) => {
  const { promotion, currentUser, canModify, isPro } = props;
  return (
    <div className="card1 promotion-page">
      <PromotionPageHeader {...props} />
      <div className="buttons flex center">
        <Button raised primary>
          <T id="PromotionPage.addCustomer" />
        </Button>
        {canModify && (
          <PromotionDocumentsManager
            promotion={promotion}
            currentUser={currentUser}
          />
        )}
      </div>
      <PromotionLotsTable promotion={promotion} />
    </div>
  );
};

export default PromotionPage;
