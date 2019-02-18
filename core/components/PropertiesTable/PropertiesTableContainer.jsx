import React from 'react';
import { compose, mapProps } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import proProperties from '../../api/properties/queries/proProperties';
import T, { Money } from '../Translation';
import StatusLabel from '../StatusLabel';
import { PROPERTIES_COLLECTION } from '../../api/constants';

const columnOptions = [
  { id: 'address' },
  { id: 'status' },
  { id: 'value' },
].map(({ id }) => ({ id, label: <T id={`PropertiesTable.${id}`} /> }));

const mapProperty = ({ address1, status, totalValue }) => ({
  columns: [
    address1,
    {
      raw: status,
      label: <StatusLabel status={status} collection={PROPERTIES_COLLECTION} />,
    },
    { raw: totalValue, label: <Money value={totalValue} /> },
  ],
});

export default compose(
  withSmartQuery({
    query: proProperties,
    queryOptions: { reactive: false },
    renderMissingDoc: false,
    dataName: 'properties',
  }),
  mapProps(({ properties }) => ({
    rows: properties.map(mapProperty),
    columnOptions,
  })),
);
