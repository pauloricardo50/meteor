import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import { proProperties } from '../../api/properties/queries';
import T, { Money } from '../Translation';
import StatusLabel from '../StatusLabel';
import { PROPERTIES_COLLECTION } from '../../api/constants';
import { proPropertySummary } from '../../api/fragments';
import PropertyUsers from './PropertyUsers';

const columnOptions = [
  { id: 'address' },
  { id: 'status' },
  { id: 'value' },
  { id: 'customers' },
  { id: 'users' },
].map(({ id }) => ({ id, label: <T id={`PropertiesTable.${id}`} /> }));

const makeMapProperty = history => ({
  _id,
  address1,
  city,
  status,
  totalValue,
  loanCount,
  users = [],
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
    {
      raw: users.length && users[0].name,
      label: <PropertyUsers users={users} />,
    },
  ],
});

export default compose(
  withSmartQuery({
    query: proProperties,
    params: { fetchOrganisationProperties: true, $body: proPropertySummary() },
    queryOptions: { reactive: false },
    renderMissingDoc: false,
    dataName: 'properties',
  }),
  withRouter,
  mapProps(({ properties, history }) => ({
    rows: properties.map(makeMapProperty(history)),
    columnOptions,
    title: <T id="ProDashboardPage.organisationProperties" />,
  })),
);
