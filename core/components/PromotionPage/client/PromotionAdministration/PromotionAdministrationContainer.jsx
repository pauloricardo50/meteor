import React, { useContext, useMemo, useState } from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { S3_ACLS } from '../../../../api/files/fileConstants';
import { moneyField } from '../../../../api/helpers/sharedSchemas';
import { LOT_TYPES } from '../../../../api/lots/lotConstants';
import { lotInsert } from '../../../../api/lots/methodDefinitions';
import {
  addPromotionLotGroup,
  insertPromotionProperty,
  promotionRemove,
  promotionUpdate,
  toggleNotifications,
} from '../../../../api/promotions/methodDefinitions';
import {
  BasePromotionSchema,
  basePromotionLayout,
} from '../../../../api/promotions/schemas/PromotionSchema';
import { PROPERTY_TYPE } from '../../../../api/properties/propertyConstants';
import useCurrentUser from '../../../../hooks/useCurrentUser';
import { ModalManagerContext } from '../../../ModalManager';
import ConfirmModal from '../../../ModalManager/ConfirmModal';
import DialogForm from '../../../ModalManager/DialogForm';
import T from '../../../Translation';
import PromotionMetadataContext from '../PromotionMetadata';

const promotionDocuments = [
  {
    id: 'promotionImage',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
    displayableFile: true,
  },
  {
    id: 'promotionDocuments',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
  },
  {
    id: 'logos',
    acl: S3_ACLS.PUBLIC_READ,
    noTooltips: true,
    displayableFile: true,
  },
  { id: 'promotionGuide', acl: S3_ACLS.PUBLIC_READ, noTooltips: true },
];

export const getPromotionLotSchema = (promotionLotGroups = []) =>
  new SimpleSchema({
    name: { type: String, uniforms: { autoFocus: true, placeholder: 'A' } },
    promotionLotGroupIds: {
      type: Array,
      optional: true,
      condition: !!promotionLotGroups.length,
      uniforms: {
        displayEmpty: false,
        placeholder: '',
      },
    },
    'promotionLotGroupIds.$': {
      type: String,
      allowedValues: promotionLotGroups.map(({ id }) => id),
      uniforms: {
        transform: id =>
          promotionLotGroups.find(({ id: groupId }) => id === groupId).label,
      },
    },
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

export const promotionLotGroupSchema = new SimpleSchema({
  label: {
    type: String,
    uniforms: {
      label: <T id="Forms.promotionLotGroup.label" />,
      placeholder: 'Immeuble A',
    },
  },
});

const getOptions = ({
  metadata: { permissions, enableNotifications },
  openModal,
  promotion,
  openDocumentsModal,
  openProInvitationModal,
  openLinkLoanModal,
  openPromotionLotGroupsModal = () => null,
}) => {
  const { _id: promotionId, promotionLotGroups = [] } = promotion;
  const {
    canModifyPromotion,
    canManageDocuments,
    canAddLots,
    canAddPros,
    canRemovePromotion,
    canLinkLoan,
  } = permissions;
  const { isPro } = useCurrentUser();
  const promotionLotSchema = useMemo(
    () => getPromotionLotSchema(promotionLotGroups),
    [promotionLotGroups],
  );

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
            layout={basePromotionLayout}
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
      id: 'managePromotionLotGroups',
      dividerTop: true,
      condition: canModifyPromotion,
      onClick: openPromotionLotGroupsModal,
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
  const [
    openPromotionLotGroupsModal,
    setOpenPromotionLotGroupsModal,
  ] = useState(false);

  return {
    options: getOptions({
      metadata,
      openModal,
      promotion,
      openDocumentsModal: () => setOpenDocumentsModal(true),
      openProInvitationModal: () => setOpenProInvitationModal(true),
      openLinkLoanModal: () => setOpenLinkLoanModal(true),
      openPromotionLotGroupsModal: () => setOpenPromotionLotGroupsModal(true),
    }),
    promotionDocuments,
    openDocumentsModal,
    setOpenDocumentsModal,
    openProInvitationModal,
    setOpenProInvitationModal,
    openLinkLoanModal,
    setOpenLinkLoanModal,
    permissions: metadata.permissions,
    openPromotionLotGroupsModal,
    setOpenPromotionLotGroupsModal,
  };
});
