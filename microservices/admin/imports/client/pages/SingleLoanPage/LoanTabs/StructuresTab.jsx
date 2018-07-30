// @flow
import React from 'react';

import FinancingStructures from 'core/components/FinancingStructures';

type StructuresTabProps = {};

const StructuresTab = ({ loan }: StructuresTabProps) => (
  <FinancingStructures loan={loan} />
);

export default StructuresTab;
