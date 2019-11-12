import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps, withState } from 'recompose';
import moment from 'moment';

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
  { id: 'createdAt' },
  { id: 'value', style: { whiteSpace: 'nowrap' } },
  { id: 'customers' },
  { id: 'users' },
].map(({ id }) => ({ id, label: <T id={`PropertiesTable.${id}`} /> }));

export const makeMapProperty = ({ history, currentUser }) => ({
  _id: propertyId,
  address1,
  city,
  createdAt,
  loanCount,
  status,
  totalValue,
  users = [],
}) => ({
  id: propertyId,
  columns: [
    [address1, city].filter(x => x).join(', '),
    {
      raw: status,
      label: <StatusLabel status={status} collection={PROPERTIES_COLLECTION} />,
    },
    {
      raw: createdAt && createdAt.getTime(),
      label: moment(createdAt).fromNow(),
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
    if (
      currentUser.isAdmin ||
      currentUser.isDev ||
      users.find(({ _id }) => _id === currentUser._id)
    ) {
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
  withState('propertyValue', 'setPropertyValue', { $gte: 0, $lte: 5000000 }),
  withState('search', 'setSearch', ''),
  withSmartQuery({
    query: proProperties,
    params: ({ fetchOrganisationProperties, propertyValue, search }) => ({
      $body: proPropertySummary(),
      fetchOrganisationProperties,
      value: propertyValue,
      search,
    }),
    queryOptions: { reactive: false },
    renderMissingDoc: false,
    dataName: 'properties',
  }),
  withRouter,
  withProps(({ properties, history, currentUser }) => ({
    rows: properties.map(makeMapProperty({ history, currentUser })),
    columnOptions,
    title: <T id="ProDashboardPage.properties" />,
  })),
);
