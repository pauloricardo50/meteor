// @flow
import React from 'react';

import Table from 'core/components/Table';
import T from 'core/components/Translation';
import ProCustomersTableContainer from './ProCustomersTableContainer';

type ProCustomersTableProps = {};

const ProCustomersTable = ({ rows, columnOptions }: ProCustomersTableProps) => (
  <>
    <Table rows={rows} columnOptions={columnOptions} />
    <small style={{ marginTop: 8 }}>
      <T id="ProCustomersTable.cacheDisclaimer" />
    </small>
  </>
);

export default ProCustomersTableContainer(ProCustomersTable);
