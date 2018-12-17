// @flow
import React from 'react';
import cx from 'classnames';

import { InputAndSlider } from '../FinancingSection';
import DialogSimple from '../../../DialogSimple';
import IconButton from '../../../IconButton';
import T from '../../../Translation';

type FinancingProjectFeesProps = {
  classname: string,
};

const FinancingProjectFees = ({
  className,
  ...props
}: FinancingProjectFeesProps) => (
  <div className={cx(className, 'notary-fees')}>
    <InputAndSlider {...props} />
    <DialogSimple
      closeOnly
      renderTrigger={({ handleOpen }) => (
        <IconButton type="help" onClick={handleOpen} />
      )}
    >
      <div>
        <h3>
          <T id="general.notaryFees" />
        </h3>
      </div>
    </DialogSimple>
  </div>
);

export default FinancingProjectFees;
