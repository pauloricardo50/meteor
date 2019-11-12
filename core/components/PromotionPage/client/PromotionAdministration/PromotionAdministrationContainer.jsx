import React, { useState, useContext } from 'react';
import SimpleSchema from 'simpl-schema';
import { withProps } from 'recompose';

import {
  toggleNotifications,
  promotionUpdate,
  insertPromotionProperty,
  lotInsert,
  promotionRemove,
} from '../../../../api/methods';
import { BasePromotionSchema } from '../../../../api/promotions/schemas/PromotionSchema';
import {
  S3_ACLS,
  ONE_KB,
  PROPERTY_TYPE,
  LOT_TYPES,
} from '../../../../api/constants';
import { moneyField } from '../../../../api/helpers/sharedSchemas';
import { CurrentUserContext } from '../../../../containers/CurrentUserContext';
import ConfirmModal from '../../../ModalManager/ConfirmModal';
import { ModalManagerContext } from '../../../ModalManager';
import DialogForm from '../../../ModalManager/DialogForm';
import T from '../../../Translation';
import PromotionMetadataContext from '../PromotionMetadata';

const promotionDocuments = [
  {
    id: 'promotionImage',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
    maxSize: 500 * ONE_KB,
  },
  {
    id: 'promotionDocuments',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
  },
  { id: 'logos', acl: S3_ACLS.PUBLIC_READ, noTooltips: true },
];

export const promotionLotSchema = new SimpleSchema({
  name: { type: String, uniforms: { autoFocus: true, placeholder: 'A' } },
  value: { ...moneyField, defaultValue: 0 },
  landValue: { ...moneyField, defaultValue: 0 },
  constructionValue: { ...moneyField, defaultValue: 0 },
  additionalMargin: { ...moneyField, defaultValue: 0 },
  propertyType: {
    type: String,
    allowedValues: Object.values(PROPERTY_TYPE),
    uniforms: { placeholder: null },
  },
  insideArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  terraceArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  gardenArea: { type: SimpleSchema.Integer, optional: true, min: 0 },
  roomCount: { type: Number, optional: true, min: 0, max: 100 },
  bathroomCount: { type: Number, optional: true, min: 0, max: 100 },
  yearlyExpenses: moneyField,
  description: {
    type: String,
    optional: true,
    uniforms: { placeholder: 'Attique avec la meilleure vue du bâtiment' },
  },
});

export const lotSchema = new SimpleSchema({
  name: { type: String, uniforms: { autoFocus: true, placeholder: '1' } },
  type: {
    type: String,
    allowedValues: Object.values(LOT_TYPES),
    uniforms: { displayEmpty: false },
  },
  description: {
    type: String,
    optional: true,
    uniforms: { placeholder: 'Parking en enfilade' },
  },
  value: { ...moneyField, min: 0 },
});

const getOptions = ({
  metadata: { permissions, enableNotifications },
  openModal,
  promotion,
  openDocumentsModal,
  openProInvitationModal,
  openLinkLoanModal,
}) => {
  const { _id: promotionId } = promotion;
  const {
    canModifyPromotion,
    canManageDocuments,
    canAddLots,
    canAddPros,
    canRemovePromotion,
    canLinkLoan,
  } = permissions;
  const { isPro } = useContext(CurrentUserContext);

  return [
    {
      id: enableNotifications ? 'disableNotifications' : 'enableNotifications',
      condition: isPro,
      onClick: () =>
        toggleNotifications.run({ promotionId }).then(result =>
          import('../../../../utils/message').then(({ default: message }) => {
            message.success(
              result
                ? 'Vos notifications par email ont été activées'
                : 'Vos notifications par email ont été désactivées',
            );
          }),
        ),
    },
    {
      id: 'updatePromotion',
      condition: canModifyPromotion,
      onClick: () =>
        openModal(
          <DialogForm
            model={promotion}
            schema={BasePromotionSchema}
            title={<T id="PromotionAdministration.updatePromotion" />}
            onSubmit={object => promotionUpdate.run({ promotionId, object })}
          />,
          { maxWidth: 'sm', fullWidth: true },
        ),
    },
    {
      id: 'manageDocuments',
      condition: canManageDocuments,
      onClick: openDocumentsModal,
    },
    {
      id: 'addUser',
      dividerTop: true,
      condition: canAddPros,
      onClick: openProInvitationModal,
    },
    {
      id: 'addPromotionLot',
      dividerTop: true,
      condition: canAddLots,
      onClick: () =>
        openModal(
          <DialogForm
            schema={promotionLotSchema}
            title={<T id="PromotionAdministration.addPromotionLot" />}
            description={<T id="PromotionPage.promotionLotValueDescription" />}
            onSubmit={property =>
              insertPromotionProperty.run({ promotionId, property })
            }
          />,
        ),
    },
    {
      id: 'addLot',
      condition: canAddLots,
      onClick: () =>
        openModal(
          <DialogForm
            schema={lotSchema}
            title={<T id="PromotionAdministration.addLot" />}
            onSubmit={lot => lotInsert.run({ promotionId, lot })}
          />,
        ),
    },
    {
      id: 'linkLoan',
      label: <span>Lier un dossier de développement</span>,
      dividerTop: true,
      condition: canLinkLoan,
      onClick: openLinkLoanModal,
    },
    {
      id: 'remove',
      label: <span className="error">Supprimer</span>,
      dividerTop: true,
      condition: canRemovePromotion,
      onClick: () =>
        openModal(
          <ConfirmModal
            func={() => promotionRemove.run({ promotionId })}
            keyword={promotion.name}
          />,
        ),
    },
  ]
    .filter(({ condition }) => !!condition)
    .map(option => ({
      ...option,
      label: option.label || <T id={`PromotionAdministration.${option.id}`} />,
    }));
};

export default withProps(({ promotion }) => {
  const metadata = useContext(PromotionMetadataContext);
  const { openModal } = useContext(ModalManagerContext);
  const [openDocumentsModal, setOpenDocumentsModal] = useState(false);
  const [openProInvitationModal, setOpenProInvitationModal] = useState(false);
  const [openLinkLoanModal, setOpenLinkLoanModal] = useState(false);

  return {
    options: getOptions({
      metadata,
      openModal,
      promotion,
      openDocumentsModal: () => setOpenDocumentsModal(true),
      openProInvitationModal: () => setOpenProInvitationModal(true),
      openLinkLoanModal: () => setOpenLinkLoanModal(true),
    }),
    promotionDocuments,
    openDocumentsModal,
    setOpenDocumentsModal,
    openProInvitationModal,
    setOpenProInvitationModal,
    openLinkLoanModal,
    setOpenLinkLoanModal,
  };
});
