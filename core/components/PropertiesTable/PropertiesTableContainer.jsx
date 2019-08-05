import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import { createRoute } from '../../utils/routerUtils';
import { withSmartQuery } from '../../api/containerToolkit';
import { proProperties } from '../../api/properties/queries';
import T, { Money } from '../Translation';
import StatusLabel from '../StatusLabel';
import { PROPERTIES_COLLECTION } from '../../api/constants';
import { proPropertySummary } from '../../api/fragments';

export const columnOptions = [
  { id: 'address' },
  { id: 'status' },
  { id: 'value', style: { whiteSpace: 'nowrap' } },
  { id: 'customers' },
].map(({ id }) => ({ id, label: <T id={`PropertiesTable.${id}`} /> }));

export const makeMapProperty = history => ({
  _id,
  address1,
  city,
  status,
  totalValue,
  loanCount,
}) => ({
  id: _id,
  columns: [
    [address1, city].filter(x => x).join(', '),
    {
      raw: status,
      label: <StatusLabel status={status} collection={PROPERTIES_COLLECTION} />,
    },
    { raw: totalValue, label: <Money value={totalValue} /> },
    loanCount,
  ],
  handleClick: () =>
    history.push(createRoute('/properties/:propertyId', { propertyId: _id })),
});

export default compose(
  withSmartQuery({
    query: proProperties,
    params: { $body: proPropertySummary() },
    queryOptions: { reactive: false },
    renderMissingDoc: false,
    dataName: 'properties',
  }),
  withRouter,
  mapProps(({ properties, history }) => ({
    rows: properties.map(makeMapProperty(history)),
    columnOptions,
    title: <T id="ProDashboardPage.properties" />,
  })),
);
