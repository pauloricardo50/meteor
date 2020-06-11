import React from 'react';
import { faCommentLines } from '@fortawesome/pro-duotone-svg-icons/faCommentLines';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

import { proAddLoanTask } from '../../api/tasks/methodDefinitions';
import { employeesById } from '../../arrays/epotekEmployees';
import colors from '../../config/colors';
import { AutoFormDialog } from '../AutoForm2';
import Icon, { FaIcon } from '../Icon';
import IconButton from '../IconButton';

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
}) => {
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
        type={
          <FaIcon
            icon={faCommentLines}
            color={hasProNote ? colors.primary : colors.borderGrey}
          />
        }
        tooltip={tooltip}
        className="mr-8"
        style={{ fontSize: 16 }}
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
