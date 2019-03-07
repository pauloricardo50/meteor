// @flow
import React from 'react';

import Icon from '../Icon';
import T from '../Translation';

type LoanProgressHeaderProps = {};

const LoanProgressHeader = (props: LoanProgressHeaderProps) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <T id="PromotionLotLoansTable.loanProgress" />
    <div style={{ display: 'flex' }}>
      <Icon type="info" tooltip="Formulaires remplis" />
      <Icon type="attachFile" tooltip="Documents uploadés" />
      <Icon type="eye" tooltip="Statut de la vérification e-Potek" />
    </div>
  </div>
);

export default LoanProgressHeader;
