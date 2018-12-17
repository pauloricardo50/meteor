// @flow
import React from 'react';
import cx from 'classnames';

import { InputAndSlider } from '../FinancingSection';
import DialogSimple from '../../../DialogSimple';
import IconButton from '../../../IconButton';
import T from '../../../Translation';
import Recap from '../../../Recap';
import FinancingDataContainer from '../containers/FinancingDataContainer';
import Calculator from '../../../../utils/Calculator';

type FinancingProjectFeesProps = {
  classname: string,
};

const FinancingProjectFees = ({
  className,
  ...props
}: FinancingProjectFeesProps) => {
  const { loan, structureId } = props;
  const canton = Calculator.makeSelectPropertyKey('canton')({
    loan,
    structureId,
  });
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
          <T id="FinancingProjectFees.description" values={{ canton }} />
          <Recap loan={loan} structureId={structureId} arrayName="notaryFees" />
        </div>
      </DialogSimple>
    </div>
  );
};

export default FinancingDataContainer(FinancingProjectFees);
