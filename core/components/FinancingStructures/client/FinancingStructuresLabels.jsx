// @flow
import React from 'react';
import cx from 'classnames';

import T from 'core/components/Translation';
import type { structureType } from 'core/api';
import { makeFilterConfig } from './FinancingStructuresSection/financingStructuresSectionHelpers';
import FinancingStructuresLabel from './FinancingStructuresLabel';
import StructuresContainer from './containers/StructuresContainer';

type FinancingStructureLabelsProps = {
  config: Array<{ id: string, label: React.Node }>,
  className?: string,
  structures: Array<structureType>,
};

const FinancingStructuresLabels = ({
  config,
  className,
  structures,
}: FinancingStructureLabelsProps) => (
  <div className={cx('financing-structures-labels', className)}>
    {config.filter(makeFilterConfig(structures)).map(({ id, label }) => (
      <FinancingStructuresLabel id={id} key={id}>
        {label || <T id={`FinancingStructures.${id}`} />}
      </FinancingStructuresLabel>
    ))}
  </div>
);

export default StructuresContainer(FinancingStructuresLabels);
