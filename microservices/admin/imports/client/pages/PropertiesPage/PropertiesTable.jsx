import React from 'react';

import Table from 'core/components/Table';
import PropertiesTableContainer from './PropertiesTableContainer';

const PropertiesTable = ({ rows, columnOptions }) => (
  <Table rows={rows} columnOptions={columnOptions} clickable noIntl />
);

export default PropertiesTableContainer(PropertiesTable);
