// @flow
import React from 'react';

import Table from 'core/components/Table';
import PropertiesTableContainer from './PropertiesTableContainer';

type PropertiesTableProps = {};

const PropertiesTable = ({ rows, columnOptions }: PropertiesTableProps) => (
  <Table rows={rows} columnOptions={columnOptions} clickable noIntl />
);

export default PropertiesTableContainer(PropertiesTable);
