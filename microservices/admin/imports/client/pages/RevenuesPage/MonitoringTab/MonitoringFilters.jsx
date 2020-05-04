import React from 'react';

import { LOAN_CATEGORIES, LOAN_STATUS } from 'core/api/loans/loanConstants';
import { REVENUE_TYPES } from 'core/api/revenues/revenueConstants';
import Select from 'core/components/Select';
import MongoSelect from 'core/components/Select/MongoSelect';

const MonitoringFilters = ({
  category,
  status,
  groupBy,
  withAnonymous,
  makeSetState,
  allowedGroupBy,
  filters,
  assigneeLinkId,
  admins,
  referringOrganisations,
  referringOrganisationId,
  revenueType,
  additionalFilters = [],
}) => (
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
          options={[
            { id: true, label: 'Avec' },
            { id: false, label: 'Sans' },
          ]}
          className="mr-8"
        />
        <MongoSelect
          value={assigneeLinkId}
          onChange={makeSetState('assigneeLinkId')}
          options={admins.map(admin => ({ id: admin._id, label: admin.name }))}
          id="assigneeLinkId"
          label="Conseiller principal du dossier"
          className="mr-8"
          style={{ minWidth: 260 }}
        />
        <MongoSelect
          value={referringOrganisationId}
          onChange={makeSetState('referringOrganisationId')}
          options={referringOrganisations.map(org => ({
            id: org._id,
            label: org.name,
          }))}
          id="referringOrganisationId"
          label="Organisation référante"
          className="mr-8"
          error="N'inclut pas les anonymes"
          style={{ minWidth: 200 }}
        />
        {additionalFilters.includes('revenueType') && (
          <MongoSelect
            value={revenueType}
            onChange={makeSetState('revenueType')}
            options={REVENUE_TYPES}
            id="type"
            label="Type de revenus"
            className="mr-8"
            style={{ minWidth: 150 }}
          />
        )}
        {filters}
      </div>
    </div>
  </div>
);

export default MonitoringFilters;
