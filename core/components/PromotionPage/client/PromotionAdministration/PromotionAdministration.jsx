// @flow
import React, { useContext, useState } from 'react';
import SimpleSchema from 'simpl-schema';

import { CurrentUserContext } from '../../../../containers/CurrentUserContext';
import {
  toggleNotifications,
  promotionUpdate,
  addProUserToPromotion,
  insertPromotionProperty,
  lotInsert,
  promotionRemove,
} from '../../../../api/methods';
import { BasePromotionSchema } from '../../../../api/promotions/schemas/PromotionSchema';
import {
  PROMOTIONS_COLLECTION,
  S3_ACLS,
  ONE_KB,
  ROLES,
  USERS_COLLECTION,
  PROPERTY_TYPE,
  LOT_TYPES,
} from '../../../../api/constants';
import { userSearch } from '../../../../api/users/queries';
import { moneyField } from '../../../../api/helpers/sharedSchemas';
import ConfirmModal from '../../../ModalManager/ConfirmModal';
import CollectionSearch from '../../../CollectionSearch';
import CollectionIconLink from '../../../IconLink/CollectionIconLink';
import Button from '../../../Button';
import DropdownMenu from '../../../DropdownMenu';
import Icon from '../../../Icon';
import { ModalManagerContext } from '../../../ModalManager';
import DialogForm from '../../../ModalManager/DialogForm';
import T from '../../../Translation';
import UploaderArray from '../../../UploaderArray';
import Dialog from '../../../Material/Dialog';
import PromotionMetadataContext from '../PromotionMetadata';

type PromotionAdministrationProps = {};

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
}) => {
  const { _id: promotionId } = promotion;
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
      id: enableNotifications ? 'disableNotifications' : 'enableNotifications',
      condition: isPro,
      onClick: () =>
        toggleNotifications.run({ promotionId }).then(result =>
          import('../../../../utils/message').then(({ default: message }) => {
            message.success(result
              ? 'Vos notifications par email ont été activées'
              : 'Vos notifications par email ont été désactivées');
          })),
    },
    {
      id: 'updatePromotion',
      condition: canModifyPromotion,
      onClick: () =>
        openModal(<DialogForm
          model={promotion}
          schema={BasePromotionSchema}
          title={<T id="PromotionAdministration.updatePromotion" />}
          onSubmit={object => promotionUpdate.run({ promotionId, object })}
        />),
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
        openModal(<DialogForm
          schema={promotionLotSchema}
          title={<T id="PromotionAdministration.addPromotionLot" />}
          description={<T id="PromotionPage.promotionLotValueDescription" />}
          onSubmit={property =>
            insertPromotionProperty.run({ promotionId, property })
          }
        />),
    },
    {
      id: 'addLot',
      condition: canAddLots,
      onClick: () =>
        openModal(<DialogForm
          schema={lotSchema}
          title={<T id="PromotionAdministration.addLot" />}
          onSubmit={lot => lotInsert.run({ promotionId, lot })}
        />),
    },
    {
      id: 'remove',
      label: <span className="error">Supprimer</span>,
      dividerTop: true,
      condition: canRemovePromotion,
      onClick: () =>
        openModal(<ConfirmModal
          func={() => promotionRemove.run({ promotionId })}
          keyword={promotion.name}
        />),
    },
  ]
    .filter(({ condition }) => !!condition)
    .map(option => ({
      ...option,
      label: option.label || <T id={`PromotionAdministration.${option.id}`} />,
    }));
};

const PromotionAdministration = ({
  promotion,
}: PromotionAdministrationProps) => {
  const currentUser = useContext(CurrentUserContext);
  const metadata = useContext(PromotionMetadataContext);
  const { openModal } = useContext(ModalManagerContext);
  const [openDocumentsModal, setOpenDocumentsModal] = useState(false);
  const [openProInvitationModal, setOpenProInvitationModal] = useState(false);

  const { _id: promotionId } = promotion;
  const options = getOptions({
    metadata,
    openModal,
    promotion,
    openDocumentsModal: () => setOpenDocumentsModal(true),
    openProInvitationModal: () => setOpenProInvitationModal(true),
  });

  if (options.length === 0) {
    return null;
  }

  const dialogActions = [
    <Button primary onClick={() => setOpenDocumentsModal(false)} key="close">
      <T id="general.close" />
    </Button>,
  ];

  return (
    <>
      {/* The following 2 modals need to receive reactive data, and can not be used with the ModalManager */}
      <Dialog
        title={<T id="PromotionAdministration.manageDocuments" />}
        open={openDocumentsModal}
        onClose={() => setOpenDocumentsModal(false)}
        actions={dialogActions}
      >
        <UploaderArray
          doc={promotion}
          collection={PROMOTIONS_COLLECTION}
          documentArray={promotionDocuments}
          currentUser={currentUser}
          allowRequireByAdmin={false}
        />
      </Dialog>

      <Dialog
        title={<T id="PromotionAdministration.addUser" />}
        open={openProInvitationModal}
        onClose={() => setOpenProInvitationModal(false)}
        actions={dialogActions}
      >
        <div className="flex-col">
          <CollectionSearch
            query={userSearch}
            queryParams={{ roles: [ROLES.PRO] }}
            title="Rechercher un utilisateur PRO"
            renderItem={user => (
              <div className="user-search-item">
                <CollectionIconLink
                  relatedDoc={{ ...user, collection: USERS_COLLECTION }}
                  placement="left"
                />
                <Button
                  onClick={() =>
                    addProUserToPromotion.run({
                      promotionId,
                      userId: user._id,
                    })
                  }
                  primary
                  disabled={
                    promotion.users
                    && promotion.users.map(({ _id }) => _id).includes(user._id)
                  }
                >
                  <T id="AdminPromotionPage.addUser" />
                </Button>
              </div>
            )}
          />
        </div>
      </Dialog>

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
    </>
  );
};

export default PromotionAdministration;
