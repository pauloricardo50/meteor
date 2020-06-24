import React from 'react';
import SimpleSchema from 'simpl-schema';

import { LOAN_STATUS } from 'core/api/loans/loanConstants';
import { attachLoanToPromotion } from 'core/api/promotions/methodDefinitions';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';

const schema = new SimpleSchema({
  showAllLots: { type: Boolean, defaultValue: false },
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
          Le client recevra un email d'invitation à la promotion.
        </div>
      }
    />
  );
};

export default PromotionAttacher;
