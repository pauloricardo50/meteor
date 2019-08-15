// @flow
import React, { useContext } from 'react';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import DropdownMenu from '../../../DropdownMenu';
import Icon from '../../../Icon';
import T from '../../../Translation';
import PromotionMetadataContext from '../PromotionMetadata';

type PromotionAdministrationProps = {};

const getOptions = (permissions) => {
  const {
    canModifyPromotion,
    canManageDocuments,
    canAddLots,
    canAddPros,
    canRemovePromotion,
  } = permissions;
  const { isPro } = useContext(CurrentUserContext);

  return [
    {
      id: 'toggleNotifications',
      condition: isPro,
    },
    {
      id: 'updatePromotion',
      condition: canModifyPromotion,
    },
    {
      id: 'manageDocuments',
      condition: canManageDocuments,
    },
    {
      id: 'addUser',
      dividerTop: true,
      condition: canAddPros,
    },
    {
      id: 'addPromotionLot',
      dividerTop: true,
      condition: canAddLots,
    },
    { id: 'addLot', condition: canAddLots },
    {
      id: 'remove',
      label: <span className="error">Supprimer</span>,
      dividerTop: true,
      condition: canRemovePromotion,
    },
  ]
    .filter(({ condition }) => !!condition)
    .map(option => ({
      ...option,
      label: option.label || <T id={`PromotionAdministration.${option.id}`} />,
    }));
};

const PromotionAdministration = (props: PromotionAdministrationProps) => {
  const { permissions } = useContext(PromotionMetadataContext);
  const options = getOptions(permissions);

  if (options.length === 0) {
    return null;
  }

  return (
    <DropdownMenu
      button
      buttonProps={{
        label: <T id="PromotionAdministration.buttonLabel" />,
        raised: true,
        primary: true,
        icon: <Icon type="settings" />,
      }}
      options={options}
      noWrapper
      menuProps={{
        anchorOrigin: { vertical: 'bottom', horizontal: 'start' },
        transformOrigin: { vertical: 'top', horizontal: 'start' },
      }}
    />
  );
};

export default PromotionAdministration;
