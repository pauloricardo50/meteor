// @flow
import React from 'react';

import { isAllowedToRemoveCustomerFromPromotion } from '../../../../api/security/clientSecurityHelpers';
import DropdownMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import { AutoFormDialog } from '../../../AutoForm2/AutoFormDialog';
import PromotionCustomersTableActionsContainer from './PromotionCustomersTableActionsContainer';
import { CustomerAdderUserSchema } from '../CustomerAdder';

type PromotionCustomersTableActionsProps = {};

const PromotionCustomersTableActions = ({
  promotion,
  currentUser,
  customerOwnerType,
  handleRemove,
  handleOpenForm,
  openDialog,
  setOpenDialog,
  editLots,
  loan,
  loading,
}: PromotionCustomersTableActionsProps) => {
  const { user = {}, promotionOptions = [], isAnonymized } = loan;
  const options = [];
  const isAllowedToRemove = isAllowedToRemoveCustomerFromPromotion({
    promotion,
    currentUser,
    customerOwnerType,
  });
  const isAllowedToSee = !isAnonymized;

  if (isAllowedToSee) {
    options.push({
      id: 'edit',
      label: <T id="PromotionUsersTableActions.editLots" />,
      onClick: handleOpenForm,
    });
  }
  if (isAllowedToRemove && isAllowedToSee) {
    options.push({
      id: 'remove',
      label: <T id="general.remove" />,
      onClick: handleRemove,
    });
  }

  if (options.length === 0) {
    return <span className="actions">-</span>;
  }

  return (
    <>
      <DropdownMenu iconType="settings" className="actions" options={options} />
      <AutoFormDialog
        open={openDialog}
        schema={CustomerAdderUserSchema({
          promotion,
        }).pick('promotionLotIds', 'showAllLots')}
        model={{
          promotionLotIds: promotionOptions.map(({ promotionLots }) => promotionLots[0]._id),
          showAllLots: promotion.$metadata.showAllLots,
        }}
        onSubmit={editLots}
        setOpen={setOpenDialog}
        title={(
          <T
            id="PromotionUsersTableActions.editLots.title"
            values={{ name: user.name }}
          />
        )}
        noButton
      />
    </>
  );
};

export default PromotionCustomersTableActionsContainer(PromotionCustomersTableActions);
