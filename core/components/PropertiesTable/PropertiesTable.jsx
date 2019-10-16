// @flow
import React from 'react';

import Table from '../Table';
import PropertiesTableContainer from './PropertiesTableContainer';
import T from '../Translation';
import Select from '../Select';
import MongoRange from '../Slider/MongoRange';
import { toMoney } from '../../utils/conversionFunctions';

type PropertiesTableProps = {};

export const PropertiesTable = ({
  fetchOrganisationProperties,
  setFetchOrganisationProperties,
  propertyValue,
  setPropertyValue,
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
      className="mr-16"
    />
    <div style={{ width: 250, display: 'inline-flex' }} className="flex-col">
      <label htmlFor="propertyValue">
        <T id="PropertiesTable.value" />
      </label>
      <MongoRange
        style={{ width: 250, marginLeft: 14, marginTop: 8 }}
        max={5000000}
        step={10000}
        value={propertyValue}
        onChange={setPropertyValue}
        id="propertyValue"
        valueLabelFormat={toMoney}
      />
    </div>
    <Table {...props} />
  </div>
);

export default PropertiesTableContainer(PropertiesTable);
