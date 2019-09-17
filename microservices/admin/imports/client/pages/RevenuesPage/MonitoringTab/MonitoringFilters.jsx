// @flow
import React from 'react';

import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import T from 'core/components/Translation';
import { LOAN_CATEGORIES } from 'imports/core/api/constants';
import { LOAN_STATUS } from 'core/api/constants';

type MonitoringFiltersProps = {};

const MonitoringFilters = ({
  category,
  status,
  groupBy,
  value,
  withAnonymous,
  makeSetState,
}: MonitoringFiltersProps) => (
  <div>
    <h4>Affichage</h4>
    <Select
      label="Grouper par"
      options={[
        { id: 'status', label: 'Statut' },
        { id: 'createdAt', label: "Date d'ajout" },
        { id: 'revenueDate', label: 'Date des revenus' },
      ]}
      onChange={(_, v) => makeSetState('groupBy')(v)}
      value={groupBy}
      className="mr-8"
    />
    <Select
      label="Afficher"
      options={[
        { id: 'count', label: 'Total' },
        { id: 'revenues', label: 'Revenus' },
        { id: 'loanValue', label: 'Volume hypothécaire' },
      ]}
      onChange={(_, v) => makeSetState('value')(v)}
      value={value}
    />
    <br />
    <h4>Filtres</h4>
    <MongoSelect
      value={category}
      onChange={makeSetState('category')}
      options={LOAN_CATEGORIES}
      id="category"
      label="Catégorie"
      className="mr-8"
    />
    <MongoSelect
      value={status}
      onChange={makeSetState('status')}
      options={LOAN_STATUS}
      id="status"
      label="Statut"
      className="mr-8"
    />
    <Select
      label="Anonymes"
      value={withAnonymous}
      onChange={(_, v) => makeSetState('withAnonymous')(v)}
      options={[{ id: true, label: 'Avec' }, { id: false, label: 'Sans' }]}
    />
  </div>
);

export default MonitoringFilters;
