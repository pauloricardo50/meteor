// @flow
import React from 'react';

import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';
import { LOAN_CATEGORIES } from 'imports/core/api/constants';
import { LOAN_STATUS } from 'core/api/constants';

type MonitoringFiltersProps = {};

const MonitoringFilters = ({
  category,
  status,
  groupBy,
  withAnonymous,
  makeSetState,
  allowedGroupBy,
}: MonitoringFiltersProps) => (
  <div className="flex">
    <div className="flex-col mr-16">
      <h4>Affichage</h4>
      <Select
        label="Grouper par"
        options={[
          { id: 'status', label: 'Statut' },
          { id: 'createdAt', label: "Date d'ajout" },
          { id: 'revenueDate', label: 'Date des revenus' },
        ].filter(({ id }) => allowedGroupBy.includes(id))}
        onChange={makeSetState('groupBy')}
        value={groupBy}
        className="mr-8"
      />
    </div>

    <div className="flex-col">
      <h4>Filtres</h4>
      <div>
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
          onChange={makeSetState('withAnonymous')}
          options={[{ id: true, label: 'Avec' }, { id: false, label: 'Sans' }]}
        />
      </div>
    </div>
  </div>
);

export default MonitoringFilters;
