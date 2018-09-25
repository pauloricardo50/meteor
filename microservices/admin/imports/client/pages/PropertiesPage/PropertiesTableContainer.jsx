import React from 'react';
import { compose, withProps } from 'recompose';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { IntlNumber } from 'core/components/Translation';
import { withSmartQuery } from 'core/api';
import adminProperties from 'core/api/properties/queries/adminProperties';
import IconLink from 'core/components/IconLink/IconLink';

const mapProperty = history => ({
  _id,
  address1,
  city,
  user,
  createdAt,
  updatedAt,
  value,
  valuation: { value: expertiseValue },
  loans,
}) => ({
  id: _id,
  columns: [
    loans.map(({ name, _id: loanId }) => (
      <IconLink
        key={name}
        onClick={e => e.stopPropagation()}
        link={`/loans/${loanId}`}
        icon="dollarSign"
      >
        {name}
      </IconLink>
    )),
    `${address1}, ${city}`,
    user && user.name,
    moment(createdAt).format('D.M.YY à H:mm'),
    moment(updatedAt).fromNow(),
    value,
    expertiseValue,
  ],
  handleClick: () => history.push(`/properties/${_id}`),
});

const columnOptions = [
  { id: 'Dossiers' },
  { id: 'Addresse' },
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
    query: () => adminProperties.clone(),
    queryOptions: { reactive: false },
    renderMissingDoc: false,
    dataName: 'properties',
  }),
  withRouter,
  withProps(({ properties, history, ...rest }) => {
    console.log('properties', properties);
    console.log('rest', rest);

    return {
      rows: properties.map(mapProperty(history)),
      columnOptions,
    };
  }),
);

export default PropertiesTableContainer;
