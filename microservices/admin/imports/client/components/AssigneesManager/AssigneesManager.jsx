import React from 'react';
import { AutoFormDialog } from 'core/components/AutoForm2';
import Assignees from './Assignees';
import AssigneesManagerContainer from './AssigneesManagerContainer';

const AssigneesManager = ({
  schema,
  model = {},
  onSubmit,
  doc: { assigneeLinks = [] },
}) => (
  <div>
    <div className="flex center-align">
      <h4 className="mr-8">Répartition des conseillers</h4>
    </div>
    <div className="flex center-align">
      <div className="mr-8">
        <Assignees assigneeLinks={assigneeLinks} />
      </div>
      <AutoFormDialog
        buttonProps={{ label: 'Modifier', color: 'primary', size: 'small' }}
        model={model}
        schema={schema}
        title="Répartition des conseillers"
        description="Ajoutera une activité sur ce dossier visible pour tous"
        onSubmit={onSubmit}
      />
    </div>
  </div>
);

export default AssigneesManagerContainer(AssigneesManager);
