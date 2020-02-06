//
import React from 'react';
import cx from 'classnames';

import { InputAndSlider } from '../FinancingSection';
import DialogSimple from '../../../DialogSimple';
import IconButton from '../../../IconButton';
import T from '../../../Translation';
import Recap from '../../../Recap';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import Calculator from '../../../../utils/Calculator';

const FinancingProjectFees = ({ className, ...props }) => {
  const { loan, structureId } = props;
  const canton = Calculator.selectPropertyKey({
    loan,
    structureId,
    key: 'canton',
  });
  const notaryFees = Calculator.selectStructureKey({
    loan,
    structureId,
    key: 'notaryFees',
  });
  const hasNotaryFeesOverride = notaryFees >= 0 && notaryFees !== null;
  const hasDetailedFees = Calculator.getFeesCalculator({
    loan,
    structureId,
  }).hasDetailedConfig();
  return (
    <div className={cx(className, 'notary-fees')}>
      <InputAndSlider {...props} />
      <DialogSimple
        closeOnly
        renderTrigger={({ handleOpen }) => (
          <IconButton type="help" onClick={handleOpen} />
        )}
      >
        <div className="notary-fees-dialog">
          <h3>
            <T id="general.notaryFees" />
          </h3>
          <div>
            {hasNotaryFeesOverride ? (
              <T id="FinancingProjectFees.notaryFeesOverride" />
            ) : (
              <T
                id={
                  canton
                    ? hasDetailedFees
                      ? 'FinancingProjectFees.description'
                      : 'FinancingProjectFees.descriptionNoDetail'
                    : 'FinancingProjectFees.noCanton'
                }
                values={{ canton: <T id={`Forms.canton.${canton}`} /> }}
              />
            )}
          </div>
          {!hasNotaryFeesOverride && (
            <Recap
              loan={loan}
              structureId={structureId}
              arrayName="notaryFees"
            />
          )}
        </div>
      </DialogSimple>
    </div>
  );
};

export default FinancingDataContainer(FinancingProjectFees);
