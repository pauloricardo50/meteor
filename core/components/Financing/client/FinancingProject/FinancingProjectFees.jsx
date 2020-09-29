import React from 'react';
import cx from 'classnames';

import Calculator from '../../../../utils/Calculator';
import DialogSimple from '../../../DialogSimple';
import Icon from '../../../Icon';
import IconButton from '../../../IconButton';
import Recap from '../../../Recap';
import T from '../../../Translation';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import { FinancingField } from '../FinancingSection';

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
  const hasDetailedFees = Calculator.getNotaryFeesCalculator({
    loan,
    structureId,
  }).hasDetailedConfig();

  return (
    <div className={cx(className, 'notary-fees')}>
      <FinancingField
        {...props}
        helperText={
          !hasNotaryFeesOverride && hasDetailedFees ? (
            <T
              id="FinancingProjectFees.inputHelperText"
              values={{ canton: <T id={`Forms.canton.${canton}`} /> }}
            />
          ) : null
        }
      />
      <DialogSimple
        closeOnly
        renderTrigger={({ handleOpen }) => (
          <IconButton
            type="info"
            onClick={handleOpen}
            className="ml-8"
            size="small"
            color={hasNotaryFeesOverride ? '' : 'primary'}
          />
        )}
      >
        <div className="notary-fees-dialog">
          <h3>
            <T defaultMessage="Frais de notaire" />
          </h3>
          <div className="flex center-align nowrap">
            <Icon size={40} type="warning" className="mr-16" color="primary" />
            <div>
              {hasNotaryFeesOverride ? (
                <T defaultMessage="Vous avez choisi des frais de notaire sur mesure. Pour accéder aux frais de notaire automatiques, supprimez le contenu du champ \"Frais de notaire\"." />
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
