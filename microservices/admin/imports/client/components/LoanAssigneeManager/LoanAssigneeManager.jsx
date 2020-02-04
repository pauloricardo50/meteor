//      
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/constants';
import { loanSetAssignees } from 'core/api/loans/index';
import LoanAssignees from './LoanAssignees';

                                   

const schema = new SimpleSchema({
  assigneeLinks: { type: Array, optional: true, uniforms: { label: ' ' } },
  'assigneeLinks.$': Object,
  'assigneeLinks.$._id': {
    type: String,
    customAllowedValues: {
      query: adminUsers,
      params: () => ({
        roles: [ROLES.ADMIN],
        $body: { name: 1, $options: { sort: { name: 1 } } },
      }),
    },
    uniforms: {
      transform: user => (user ? user.name : ''),
      label: 'Conseiller',
      placeholder: null,
    },
  },
  'assigneeLinks.$.percent': {
    type: SimpleSchema.Integer,
    min: 10,
    max: 100,
    defaultValue: 100,
    uniforms: { label: 'Assist %' },
  },
  'assigneeLinks.$.isMain': {
    type: Boolean,
    defaultValue: false,
    uniforms: { label: 'Conseiller principal' },
  },
  note: {
    type: String,
    uniforms: { placeholder: 'Expliquer la raison de la nouvelle répartition' },
  },
});

const LoanAssigneeManager = ({
  loan: { _id: loanId, assigneeLinks = [] },
}                          ) => (
  <div>
    <div className="flex center-align">
      <h4 className="mr-8">Répartition des conseillers</h4>
    </div>
    <div className="flex center-align">
      <div className="mr-8">
        <LoanAssignees assigneeLinks={assigneeLinks} />
      </div>
      <AutoFormDialog
        buttonProps={{ label: 'Modifier', color: 'primary', size: 'small' }}
        model={{ assigneeLinks }}
        schema={schema}
        title="Répartition des conseillers"
        description="Ajoutera une activité sur ce dossier visible pour tous"
        onSubmit={values =>
          loanSetAssignees.run({
            loanId,
            assignees: values.assigneeLinks,
            note: values.note,
          })
        }
      />
    </div>
  </div>
);

export default LoanAssigneeManager;
