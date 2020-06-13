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
        const { name } = promotionOption;
        return {
          title: (
            <div className="modal-promotion-lot-title">
              <span>Lot {name}</span>
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
