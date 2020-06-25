import React from 'react';
import SimpleSchema from 'simpl-schema';

import { getUserNameAndOrganisation } from 'core/api/helpers';
import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import { PROMOTION_LOTS_COLLECTION } from 'core/api/promotionLots/promotionLotConstants';
import { attachLoanToPromotion } from 'core/api/promotions/methodDefinitions';
import {
  PROMOTIONS_COLLECTION,
  PROMOTION_STATUS,
} from 'core/api/promotions/promotionConstants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import PromotionLotGroupChip from 'core/components/PromotionPage/client/PromotionLotsTable/PromotionLotGroupChip';

SimpleSchema.setDefaultMessages({
  messages: {
    fr: { emptyPromotionLotIds: 'Veuillez préselectionner au moins un lot' },
  },
});

const schema = new SimpleSchema({
  promotionId: {
    type: String,
    customAllowedValues: {
      query: PROMOTIONS_COLLECTION,
      params: {
        $filters: { status: PROMOTION_STATUS.OPEN },
        name: 1,
      },
    },
    uniforms: {
      transform: ({ name }) => name,
      label: 'Promotion',
    },
  },
  invitedBy: {
    type: String,
    customAllowedValues: {
      query: PROMOTIONS_COLLECTION,
      params: ({ promotionId }) => ({
        $filters: { _id: promotionId },
        users: { name: 1, organisations: { name: 1 } },
      }),
      postProcess: promotions => promotions[0].users,
    },
    uniforms: {
      transform: user => getUserNameAndOrganisation({ user }),
    },
    condition: ({ promotionId }) => !!promotionId,
  },
  promotionLotIds: {
    type: Array,
    condition: ({ promotionId }) => !!promotionId,
    customAllowedValues: {
      query: PROMOTION_LOTS_COLLECTION,
      params: ({ promotionId }) => ({
        $filters: { 'promotionCache.0._id': promotionId },
        name: 1,
        promotion: { promotionLotGroups: 1 },
        promotionLotGroupIds: 1,
      }),
    },
    uniforms: {
      transform: ({ name, promotion, promotionLotGroupIds = [] }) => (
        <div>
          {name}&nbsp;
          {promotionLotGroupIds.map(promotionLotGroupId => {
            const promotionLotGroup = promotion.promotionLotGroups.find(
              ({ id }) => id === promotionLotGroupId,
            );

            return (
              promotionLotGroup && (
                <PromotionLotGroupChip
                  key={promotionLotGroupId}
                  promotionLotGroup={promotionLotGroup}
                />
              )
            );
          })}
        </div>
      ),
      placeholder: null,
    },
    custom() {
      if (this.value.length === 0) {
        return 'emptyPromotionLotIds';
      }
    },
  },
  'promotionLotIds.$': {
    type: String,
  },
  showAllLots: {
    type: Boolean,
    defaultValue: false,
    condition: ({ promotionLotIds }) => !!promotionLotIds?.length,
  },
});

const getDisableReason = ({ status, hasPromotion, userCache, lenders }) => {
  if (
    [
      LOAN_STATUS.CLOSING,
      LOAN_STATUS.BILLING,
      LOAN_STATUS.FINALIZED,
      LOAN_STATUS.UNSUCCESSFUL,
    ].includes(status)
  ) {
    return 'Pas possible pour les dossiers en closing et +';
  }

  if (hasPromotion) {
    return 'Déjà sur une promotion';
  }

  if (!userCache?._id) {
    return 'Il faut un compte sur ce dossier';
  }

  if (lenders.some(({ offers = [] }) => offers.length)) {
    return "Supprimez les offres du dossier d'abord";
  }
};

const PromotionAttacher = ({ loan }) => {
  const { _id: loanId } = loan;
  const reason = getDisableReason(loan);

  return (
    <AutoFormDialog
      schema={schema}
      onSubmit={values => attachLoanToPromotion.run({ loanId, ...values })}
      buttonProps={{
        raised: true,
        primary: true,
        label: 'Ajouter à une promotion',
        disabled: !!reason,
        tooltip: reason,
      }}
      title="Ajouter ce dossier à une promotion en cours"
      description={
        <div>
          Supprimera les plans financiers existants, la capacité d'achat, et
          enlève tout bien immobilier du dossier (récupérable plus tard si il
          faut).
          <br />
          Merci de vérifier que ça ne pose pas de problème au client.
          <br />
          <h4>Le client et le courtier recevront un email.</h4>
        </div>
      }
    />
  );
};

export default PromotionAttacher;
