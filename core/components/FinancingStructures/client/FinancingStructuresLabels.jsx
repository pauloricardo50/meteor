// @flow
import React from 'react';
import cx from 'classnames';

import FinancingStructuresLabel from './FinancingStructuresLabel';

type FinancingStructureLabelsProps = {
  config: Array<{ id: string, label: React.Node }>,
  className?: string,
};

const FinancingStructuresLabels = ({
  config,
  className,
}: FinancingStructureLabelsProps) => (
  <div className={cx('financing-structures-labels', className)}>
    {config.map(({ id, label }) => (
      <FinancingStructuresLabel id={id} key={label}>
        {label || id}
      </FinancingStructuresLabel>
    ))}
  </div>
);

export default FinancingStructuresLabels;
