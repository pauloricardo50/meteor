// @flow
import React from 'react';

import Financing from 'core/components/Financing';

type StructuresTabProps = {};

const StructuresTab = ({ loan }: StructuresTabProps) => (
  <Financing loan={loan} />
);

export default StructuresTab;
