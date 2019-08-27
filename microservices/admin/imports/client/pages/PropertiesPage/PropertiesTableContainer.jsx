import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { IntlNumber } from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import { withSmartQuery } from 'core/api';
import { adminProperties } from 'core/api/properties/queries';
import { USERS_COLLECTION, PROPERTY_CATEGORY } from 'core/api/constants';
import PropertyRelatedDoc from './PropertyRelatedDoc';

const mapProperty = history => ({
  _id,
  address1,
  category,
  city,
  createdAt,
  loans,
  name,
  promotion,
  updatedAt,
  user,
  value,
}) => ({
  id: _id,
  columns: [
    <PropertyRelatedDoc
      category={category}
      loans={loans}
      promotion={promotion}
      key="relatedTo"
    />,
    name || [address1, city].filter(x => x).join(', '),
    category !== PROPERTY_CATEGORY.PROMOTION && (
      <CollectionIconLink
        relatedDoc={{ ...user, collection: USERS_COLLECTION }}
        key="user"
      />
    ),
    {
      raw: createdAt && createdAt.getTime(),
      label: moment(createdAt).fromNow(),
    },
    {
      raw: updatedAt && updatedAt.getTime(),
      label: updatedAt ? moment(updatedAt).fromNow() : '-',
    },
    value,
  ],
  handleClick: () => history.push(`/properties/${_id}`),
});

const columnOptions = [
  { id: 'Lié à' },
  { id: 'Nom/Addresse', format: v => <b>{v}</b> },
  { id: 'Utilisateur' },
  { id: 'Créé le' },
  { id: 'Modifié' },
  {
    id: 'Valeur du bien',
    format: value => (
      <b>
        <IntlNumber value={value} format="money" />
      </b>
    ),
    align: 'right',
  },
];

const PropertiesTableContainer = compose(
  withSmartQuery({
    query: adminProperties,
    params: {
      $body: {
        address1: 1,
        category: 1,
        city: 1,
        createdAt: 1,
        loans: { name: 1 },
        name: 1,
        promotion: { name: 1 },
        updatedAt: 1,
        user: { name: 1 },
        value: 1,
      },
    },
    queryOptions: { reactive: false },
    renderMissingDoc: false,
    dataName: 'properties',
  }),
  withRouter,
  withProps(({ properties, history }) => ({
    rows: properties.map(mapProperty(history)),
    columnOptions,
  })),
);

export default PropertiesTableContainer;
