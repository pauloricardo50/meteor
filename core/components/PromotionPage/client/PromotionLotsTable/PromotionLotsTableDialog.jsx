// @flow
import React, { useContext } from 'react';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import Button from '../../../Button';
import Dialog from '../../../Material/Dialog';
import T from '../../../Translation';
import PromotionMetadataContext from '../PromotionMetadata';
import PromotionLotDetail from '../PromotionLotDetail';
import PromotionLotModifier from './PromotionLotModifier';
import LotDocumentsManager from './LotDocumentsManager';

type PromotionLotsTableDialogProps = {};

const PromotionLotsTableDialog = ({
  open,
  promotionLot,
  promotion,
  handleClose,
}: PromotionLotsTableDialogProps) => {
  const currentUser = useContext(CurrentUserContext);
  const {
    permissions: { canModifyLots, canManageDocuments },
  } = useContext(PromotionMetadataContext);

  return (
    <Dialog
      open={open}
      title={(
        <div className="modal-promotion-lot-title">
          <span>{promotionLot && promotionLot.name}</span>
          <div>
            {canModifyLots && (
              <PromotionLotModifier
                className="mr-8"
                promotionLot={promotionLot}
              />
            )}
            {canManageDocuments && (
              <LotDocumentsManager
                documents={promotionLot && promotionLot.documents}
                property={promotionLot && promotionLot.properties[0]}
                currentUser={currentUser}
              />
            )}
          </div>
        </div>
      )}
      actions={(
        <Button primary onClick={handleClose}>
          <T id="general.close" />
        </Button>
      )}
      fullWidth
      maxWidth={false}
      onClose={handleClose}
    >
      {promotionLot && (
        <PromotionLotDetail promotionLot={promotionLot} promotion={promotion} />
      )}
    </Dialog>
  );
};

export default PromotionLotsTableDialog;
