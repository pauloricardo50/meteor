import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, mapProps, withState } from 'recompose';

import { createRoute } from '../../utils/routerUtils';
import { withSmartQuery } from '../../api/containerToolkit';
import { proProperties } from '../../api/properties/queries';
import T, { Money } from '../Translation';
import StatusLabel from '../StatusLabel';
import { PROPERTIES_COLLECTION } from '../../api/constants';
import { proPropertySummary } from '../../api/fragments';
import TooltipArray from '../TooltipArray';

export const columnOptions = [
  { id: 'address' },
  { id: 'status' },
  { id: 'value', style: { whiteSpace: 'nowrap' } },
  { id: 'customers' },
  { id: 'users' },
].map(({ id }) => ({ id, label: <T id={`PropertiesTable.${id}`} /> }));

export const makeMapProperty = ({ history, currentUser }) => ({
  _id: propertyId,
  address1,
  city,
  status,
  totalValue,
  loanCount,
  users = [],
}) => ({
  id: propertyId,
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
      label: (
        <TooltipArray items={users.map(({ name }) => name)} title="Comptes" />
      ),
    },
  ],
  handleClick: () => {
    console.log('users:', users);
    console.log('currentUser:', currentUser);
    if (users.find(({ _id }) => _id === currentUser._id)) {
      history.push(createRoute('/properties/:propertyId', { propertyId }));
    }
  },
});

export default compose(
  withState(
    'fetchOrganisationProperties',
    'setFetchOrganisationProperties',
    false,
  ),
  withSmartQuery({
    query: proProperties,
    params: ({ fetchOrganisationProperties }) => ({
      $body: proPropertySummary(),
      fetchOrganisationProperties,
    }),
    queryOptions: { reactive: false },
    renderMissingDoc: false,
    dataName: 'properties',
  }),
  withRouter,
  mapProps(({
    properties,
    history,
    currentUser,
    fetchOrganisationProperties,
    setFetchOrganisationProperties,
  }) => ({
    rows: properties.map(makeMapProperty({ history, currentUser })),
    columnOptions,
    title: <T id="ProDashboardPage.properties" />,
    fetchOrganisationProperties,
    setFetchOrganisationProperties,
  })),
);
