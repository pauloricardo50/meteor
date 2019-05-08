// @flow
import React from 'react';

import Table from '../Table';
import PropertiesTableContainer from './PropertiesTableContainer';

type PropertiesTableProps = {};

export const PropertiesTable = (props: PropertiesTableProps) => (
  <Table {...props} />
);

export default PropertiesTableContainer(PropertiesTable);
