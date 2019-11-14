// @flow
import React from 'react';

import T from '../../../Translation';
import TableWithModal from '../../../Table/TableWithModal';
import UserPromotionOptionsTableContainer from './UserPromotionOptionsTableContainer';
import PromotionOptionDialog from './PromotionOptionDialog';

type UserPromotionOptionsTableProps = {};

const UserPromotionOptionsTable = ({
  rows,
  columnOptions,
  isDashboardTable,
  promotionOptions,
  promotion,
  setCustom,
  loan,
  ...props
}: UserPromotionOptionsTableProps) => (
  <>
    <h3>
      <T id="collections.promotionOptions" />
    </h3>

    <TableWithModal
      modalType="dialog"
      getModalProps={({ row: { promotionOption }, setOpen }) => {
        const { promotionLots } = promotionOption;
        const [promotionLot] = promotionLots;
        return {
          fullWidth: true,
          maxWidth: false,
          title: (
            <div className="modal-promotion-lot-title">
              <span>{promotionLot && promotionLot.name}</span>
            </div>
          ),
          children: (
            <PromotionOptionDialog
              promotionOption={promotionOption}
              promotion={promotion}
              handleClose={() => setOpen(false)}
              loan={loan}
            />
          ),
        };
      }}
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

export default UserPromotionOptionsTableContainer(UserPromotionOptionsTable);
