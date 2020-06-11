import React from 'react';
import cx from 'classnames';

import Calculator from '../../../../utils/Calculator';
import DialogSimple from '../../../DialogSimple';
import IconButton from '../../../IconButton';
import Recap from '../../../Recap';
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
            <T id="general.reimbursementPenalty" />
          </h3>
          <div>
            {hasReimbursementPenaltyOverride ? (
              <T id="FinancingReimbursementPenalty.override" />
            ) : (
              <T id="FinancingReimbursementPenalty.description" />
            )}
          </div>
        </div>
      </DialogSimple>
    </div>
  );
};

export default FinancingDataContainer(FinancingReimbursementPenalty);
