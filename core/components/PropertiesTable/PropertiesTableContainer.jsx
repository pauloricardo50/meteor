import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { compose, withProps, withState } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import { proProperties } from '../../api/properties/queries';
import { createRoute } from '../../utils/routerUtils';
import StatusLabel from '../StatusLabel';
import TooltipArray from '../TooltipArray';
import T, { Money } from '../Translation';

export const columnOptions = [
  { id: 'address' },
  { id: 'status' },
  { id: 'createdAt' },
  { id: 'value', style: { whiteSpace: 'nowrap' } },
  { id: 'customers' },
  { id: 'users' },
].map(({ id }) => ({ id, label: <T id={`PropertiesTable.${id}`} /> }));

export const makeMapProperty = ({ history, currentUser }) => ({
  _collection,
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
      label: <StatusLabel status={status} collection={_collection} />,
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
      $body: {
        address1: 1,
        city: 1,
        createdAt: 1,
        status: 1,
        totalValue: 1,
        loanCount: 1,
        country: 1,
        userLinks: 1,
        users: { name: 1 },
      },
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
