import React from 'react';

import TableWithModal from '../../../Table/TableWithModal';
import T from '../../../Translation';
import PromotionOptionDialog from './PromotionOptionDialog';
import UserPromotionOptionsTableContainer from './UserPromotionOptionsTableContainer';

const UserPromotionOptionsTable = ({
  rows,
  columnOptions,
  isDashboardTable,
  promotionOptions,
  promotion,
  setCustom,
  loan,
  ...props
}) => (
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
