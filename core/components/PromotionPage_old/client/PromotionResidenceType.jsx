// @flow
import React from 'react';

import { COLLECTIONS } from '../../../api/constants';
import UpdateField from '../../UpdateField';
import T from '../../Translation';

type PromotionResidenceTypeProps = {
  loan: Object,
};

const PromotionResidenceType = ({ loan }: PromotionResidenceTypeProps) => {
  const { residenceType } = loan;
  return (
    <div className="card1 residence-type-setter">
      {!residenceType && (
        <p>
          <T id="Forms.promotionPage.residenceTypeSetter.text" />
        </p>
      )}
      <UpdateField
        doc={loan}
        fields={['residenceType']}
        collection={COLLECTIONS.LOANS_COLLECTION}
      />
    </div>
  );
};

export default PromotionResidenceType;
