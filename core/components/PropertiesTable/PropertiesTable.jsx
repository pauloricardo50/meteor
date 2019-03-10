// @flow
import React from 'react';

import Table from '../Table';
import PropertiesTableContainer from './PropertiesTableContainer';

type PropertiesTableProps = {};

export const PropertiesTable = ({
  rows,
  columnOptions,
}: PropertiesTableProps) => <Table rows={rows} columnOptions={columnOptions} />;

export default PropertiesTableContainer(PropertiesTable);
