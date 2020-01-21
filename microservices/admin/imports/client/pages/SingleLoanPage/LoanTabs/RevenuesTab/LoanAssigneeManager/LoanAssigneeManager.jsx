// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { employeesById } from 'core/arrays/epotekEmployees';
import { Percent } from 'core/components/Translation';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/constants';
import { loanSetAssignees } from 'core/api/loans/index';

type LoanAssigneeManagerProps = {};

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
      // labelProps: { shrink: true },
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
});

const LoanAssigneeManager = ({
  loan: { _id: loanId, assigneeLinks = [] },
}: LoanAssigneeManagerProps) => (
  <div>
    <div className="flex center-align">
      <h3 className="mr-8">Répartition des conseillers</h3>
      <AutoFormDialog
        buttonProps={{ label: 'Modifier', color: 'primary' }}
        model={{ assigneeLinks }}
        schema={schema}
        title="Répartition des conseillers"
        onSubmit={values =>
          loanSetAssignees.run({ loanId, assignees: values.assigneeLinks })
        }
      />
    </div>

    {assigneeLinks.length === 0 && 'Pas encore de répartition'}
    <div className="flex">
      {assigneeLinks.length > 0 &&
        assigneeLinks
          .sort(({ percent: p1 }, { percent: p2 }) => p2 - p1)
          .map(({ _id, percent, isMain }) => (
            <div key={_id} className="mr-16">
              <h4>
                <span className="mr-8">{employeesById[_id].name}</span>
                {isMain && (
                  <small className="secondary">Conseiller principal</small>
                )}
              </h4>
              <i>
                <Percent value={percent / 100} />
              </i>
            </div>
          ))}
    </div>
  </div>
);

export default LoanAssigneeManager;
