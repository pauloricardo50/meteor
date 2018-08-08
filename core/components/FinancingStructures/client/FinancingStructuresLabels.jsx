// @flow
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import type { structureType } from 'core/api';
import { makeFilterConfig } from './FinancingStructuresSection/financingStructuresSectionHelpers';
import FinancingStructuresLabel from './FinancingStructuresLabel';
import FinancingStructuresDataContainer from './containers/FinancingStructuresDataContainer';

type FinancingStructureLabelsProps = {
  config: Array<{ id: string, label: React.Node }>,
  className?: string,
  data: Object,
};

const FinancingStructuresLabels = ({
  config,
  className,
  ...data
}: FinancingStructureLabelsProps) => (
  <div className={cx('financing-structures-labels', className)}>
    {config.filter(makeFilterConfig(data)).map(({ id, label }) => (
      <FinancingStructuresLabel id={id} key={id}>
        {label || <T id={`FinancingStructures.${id}`} />}
      </FinancingStructuresLabel>
    ))}
  </div>
);

export default FinancingStructuresDataContainer({ asArrays: true })(FinancingStructuresLabels);
