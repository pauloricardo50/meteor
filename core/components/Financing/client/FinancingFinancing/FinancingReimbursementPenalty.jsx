import React from 'react';
import cx from 'classnames';

import Calculator from '../../../../utils/Calculator';
import DialogSimple from '../../../DialogSimple';
import IconButton from '../../../IconButton';
import T from '../../../Translation';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { FinancingField } from '../FinancingSection';

const FinancingReimbursementPenalty = ({ className, ...props }) => {
  const { loan, structureId } = props;

  const reimbursementPenalty = Calculator.selectStructureKey({
    loan,
    structureId,
    key: 'reimbursementPenalty',
  });

  const hasReimbursementPenaltyOverride =
    reimbursementPenalty >= 0 && reimbursementPenalty !== null;

  return (
    <div className={cx(className, 'notary-fees')}>
      <FinancingField {...props} />
      <DialogSimple
        closeOnly
        renderTrigger={({ handleOpen }) => (
          <IconButton
            type="help"
            onClick={handleOpen}
            className="ml-8"
            size="small"
            color={hasReimbursementPenaltyOverride ? '' : 'primary'}
          />
        )}
      >
        <div className="reimbursement-penalty-dialog">
          <h3>
            <T defaultMessage="Pénalités de remoursement" />
          </h3>
          <div>
            {hasReimbursementPenaltyOverride ? (
              <T defaultMessage="Vous avez choisi des pénalités de remboursement sur mesure. Pour accéder aux pénalités de remboursement automatiques, supprimez le contenu du champ \"Pénalités de remboursement\"" />
            ) : (
              <T defaultMessage="Les pénalités de remboursement sont calculées en additionnant tous les intérêts de vos tranches au pro rata du temps restant jusqu'à leur fin. Attention: il s'agit d'une estimation." />
            )}
          </div>
        </div>
      </DialogSimple>
    </div>
  );
};

export default FinancingDataContainer(FinancingReimbursementPenalty);
