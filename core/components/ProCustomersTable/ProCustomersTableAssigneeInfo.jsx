//      
import React from 'react';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

import Icon from 'core/components/Icon';
import IconButton from 'core/components/IconButton';
import { employeesById } from 'core/arrays/epotekEmployees';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { proAddLoanTask } from 'core/api/tasks/methodDefinitions';

                                             

const schema = new SimpleSchema({
  note: {
    type: String,
    uniforms: {
      multiline: true,
      rows: 3,
      placeholder: 'Le client sera en vacances du 1er au 15 Août',
    },
  },
});

const ProCustomersTableAssigneeInfo = ({
  proNote,
  user,
  loanId,
  anonymous,
}                                    ) => {
  const { date, note, updatedBy } = proNote;
  const noteUpdatedBy = updatedBy && employeesById[updatedBy];
  const hasProNote = !!note;

  if (anonymous) {
    return null;
  }

  const tooltip = hasProNote ? (
    <div>
      <div className="secondary">
        {moment(date).format("H:mm, D MMM 'YY")}
        {noteUpdatedBy && ` - Par ${noteUpdatedBy.name}`}
      </div>
      <div style={{ whiteSpace: 'pre-line' }}>{note}</div>
    </div>
  ) : (
      'Pas de commentaire'
    );

  const toWhom =
    user && user.assignedEmployee
      ? `à ${user.assignedEmployee.name}`
      : 'au conseiller';

  return (
    <div className="flex center-align">
      <Icon
        type="info"
        tooltip={tooltip}
        color={hasProNote ? 'primary' : ''}
        className="mr-8"
      />
      <AutoFormDialog
        schema={schema}
        title={`Envoyer une note ${toWhom}`}
        description={
          <div>
            Au sujet du dossier de <b>{user.name}</b>
          </div>
        }
        triggerComponent={handleOpen => (
          <IconButton
            type="mail"
            onClick={handleOpen}
            size="small"
            tooltip="Envoyer une note au conseiller"
          />
        )}
        onSubmit={({ note }) => proAddLoanTask.run({ loanId, note })}
      />
    </div>
  );
};

export default ProCustomersTableAssigneeInfo;
