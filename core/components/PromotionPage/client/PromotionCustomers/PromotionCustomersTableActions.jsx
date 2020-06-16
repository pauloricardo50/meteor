import React, { useMemo } from 'react';

import { isAllowedToRemoveCustomerFromPromotion } from '../../../../api/security/clientSecurityHelpers';
import { AutoFormDialog } from '../../../AutoForm2/AutoFormDialog';
import DropdownMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import { CustomerAdderUserSchema } from '../CustomerAdder';
import PromotionCustomersTableActionsContainer from './PromotionCustomersTableActionsContainer';

const PromotionCustomersTableActions = ({
  promotion,
  customerOwnerType,
  handleRemove,
  handleOpenForm,
  openDialog,
  setOpenDialog,
  editLots,
  loan,
  currentUser,
}) => {
  const { user = {}, promotionOptions = [], isAnonymized } = loan;
  const options = [];
  const isAllowedToRemove = isAllowedToRemoveCustomerFromPromotion({
    promotion,
    currentUser,
    customerOwnerType,
  });
  const isAllowedToSee = !isAnonymized;
  const schema = useMemo(
    () =>
      CustomerAdderUserSchema({
        promotion,
      }).pick('promotionLotIds', 'showAllLots'),
    [],
  );

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
      <DropdownMenu
        iconType="settings"
        className="actions"
        options={options}
        noWrapper
        buttonProps={{ size: 'small' }}
      />
      <AutoFormDialog
        open={openDialog}
        schema={schema}
        model={{
          promotionLotIds: promotionOptions.map(
            ({ promotionLots }) => promotionLots[0]._id,
          ),
          showAllLots: promotion.$metadata.showAllLots,
        }}
        onSubmit={editLots}
        setOpen={setOpenDialog}
        title={
          <T
            id="PromotionUsersTableActions.editLots.title"
            values={{ name: user.name }}
          />
        }
        noButton
      />
    </>
  );
};

export default PromotionCustomersTableActionsContainer(
  PromotionCustomersTableActions,
);
