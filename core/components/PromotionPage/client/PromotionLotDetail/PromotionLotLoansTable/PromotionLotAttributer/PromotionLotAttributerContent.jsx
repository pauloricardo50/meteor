// @flow
import React from 'react';

import { PROMOTION_OPTION_SOLVENCY } from '../../../../../../api/constants';
import T from '../../../../../Translation';

type PromotionLotAttributerContentProps = {
  promotionLotName: string,
  userName: string,
  solvency: React.Node,
};

const solvencyClassNames = {
  [PROMOTION_OPTION_SOLVENCY.UNDETERMINED]: 'warning',
  [PROMOTION_OPTION_SOLVENCY.SOLVENT]: 'success',
  [PROMOTION_OPTION_SOLVENCY.INSOLVENT]: 'error',
};

const PromotionLotAttributerContent = ({
  promotionLotName,
  userName,
  solvency,
}: PromotionLotAttributerContentProps) => (
  <div className="book-client-infos">
    <p className="bold">
      Attribuer
      {promotionLotName}
      {' '}
à
    </p>
    <table className="book-client-infos-table">
      <tr>
        <td>Nom</td>
        <td>{userName}</td>
      </tr>
      <tr>
        <td>Solvabilité</td>
        <td className={solvencyClassNames[solvency]}>
          <T id={`Forms.solvency.${solvency}`} />
        </td>
      </tr>
    </table>
  </div>
);

export default PromotionLotAttributerContent;
