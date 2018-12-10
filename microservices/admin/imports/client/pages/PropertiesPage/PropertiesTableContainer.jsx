import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { IntlNumber } from 'core/components/Translation';
import { withSmartQuery } from 'core/api';
import adminProperties from 'core/api/properties/queries/adminProperties';
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
  valuation: { value: expertiseValue },
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
    name || `${address1}, ${city}`,
    user && user.name,
    moment(createdAt).format('D.M.YY à H:mm'),
    moment(updatedAt).fromNow(),
    value,
    expertiseValue,
  ],
  handleClick: () => history.push(`/properties/${_id}`),
});

const columnOptions = [
  { id: 'Lié à' },
  { id: 'Nom/Addresse' },
  { id: 'Utilisateur' },
  { id: 'Créé le' },
  { id: 'Modifié' },
  {
    id: 'Valeur du bien',
    format: value => <IntlNumber value={value} format="money" />,
    numeric: true,
  },
  {
    id: 'Valeur expertisée',
    format: value => <IntlNumber value={value} format="money" />,
    numeric: true,
  },
];

const PropertiesTableContainer = compose(
  withSmartQuery({
    query: adminProperties,
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
