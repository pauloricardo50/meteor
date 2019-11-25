// @flow
import React, { useContext } from 'react';

import Table from '../../../Table';
import T from '../../../Translation';
import PromotionProUserAdder from './PromotionProUserAdder';
import PromotionUsersContainer from './PromotionUsersContainer';
import PromotionMetadataContext from '../PromotionMetadata';

type PromotionUsersProps = {
  promotion: Object,
  rows: Array<Object>,
  columnOptions: Array<Object>,
};

const PromotionUsers = ({
  promotion,
  rows,
  columnOptions,
}: PromotionUsersProps) => {
  const {
    permissions: { canManageProUsers },
  } = useContext(PromotionMetadataContext);
  return (
    <div className="animated fadeIn mt-16">
      <div className="card1 card-top promotion-users-table">
        <div
          className="flex center-align"
          style={{ justifyContent: 'space-between' }}
        >
          <h2>
            <T id="PromotionPage.PromotionUsers" />
          </h2>
          {canManageProUsers && <PromotionProUserAdder promotion={promotion} />}
        </div>
        <Table rows={rows} columnOptions={columnOptions} />
      </div>
    </div>
  );
};

export default PromotionUsersContainer(PromotionUsers);
