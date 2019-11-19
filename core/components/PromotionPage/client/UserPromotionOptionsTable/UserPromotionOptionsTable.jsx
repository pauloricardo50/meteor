// @flow
import React, { useState, useEffect } from 'react';

import T from '../../../Translation';
import Table from '../../../Table';
import UserPromotionOptionsTableContainer from './UserPromotionOptionsTableContainer';
import PromotionOptionDialog from './PromotionOptionDialog';

type UserPromotionOptionsTableProps = {};

const UserPromotionOptionsTable = ({
  rows,
  columnOptions,
  isDashboardTable,
  promotionOptions,
  promotionOptionModal,
  setPromotionOptionModal,
  promotion,
  setCustom,
  ...props
}: UserPromotionOptionsTableProps) => {
  const [modalPromotionOption, setModalPromotionOption] = useState();
  useEffect(() => {
    if (promotionOptionModal) {
      setModalPromotionOption(
        promotionOptions.find(({ _id }) => _id === promotionOptionModal),
      );
    }
  });

  return (
    <>
      <h3 className="text-center">
        <T id="collections.promotionOptions" />
      </h3>

      <PromotionOptionDialog
        open={!!promotionOptionModal}
        promotionOption={modalPromotionOption}
        promotion={promotion}
        handleClose={() => setPromotionOptionModal()}
        setCustom={setCustom}
      />

      <Table
        rows={rows}
        columnOptions={columnOptions}
        sortable={false}
        {...(isDashboardTable && {
          style: { overflowY: 'scroll', maxHeight: '220px' },
        })}
        {...props}
      />
    </>
  );
};
export default UserPromotionOptionsTableContainer(UserPromotionOptionsTable);
