// @flow
import React from 'react';

import Table from '../Table';
import PropertiesTableContainer from './PropertiesTableContainer';
import Select from '../Select';

type PropertiesTableProps = {};

export const PropertiesTable = ({
  fetchOrganisationProperties,
  setFetchOrganisationProperties,
  ...props
}: PropertiesTableProps) => (
  <div>
    <Select
      label="Filtre"
      value={fetchOrganisationProperties}
      onChange={(_, v) => setFetchOrganisationProperties(v)}
      options={[
        { id: false, label: 'Mes biens immobiliers' },
        { id: true, label: 'De mon organisation' },
      ]}
      className="mr-8"
    />
    <Table {...props} />
  </div>
);

export default PropertiesTableContainer(PropertiesTable);
