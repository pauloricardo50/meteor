// @flow
import React from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { STEP_ORDER } from 'core/api/constants';
import { injectIntl } from 'react-intl';
import { ACTIONS } from './loanBoardHelpers';

type LoanBoardOptionsProps = {};

const LoanBoardOptions = ({
  options,
  dispatch,
  admins,
  intl: { formatMessage: f },
}: LoanBoardOptionsProps) => {
  const { assignedEmployeeId, step } = options;
  return (
    <div className="loan-board-options">
      <Select
        label="Conseiller"
        value={assignedEmployeeId.$in}
        multiple
        options={[
          { id: null, label: 'Personne' },
          ...admins.map(admin => ({ id: admin._id, label: admin.name })),
        ]}
        onChange={(_, values) => {
          dispatch({
            type: ACTIONS.SET_FILTER,
            payload: { name: 'assignedEmployeeId', value: { $in: values } },
          });
        }}
        renderValue={selected =>
          selected
            .map((id) => {
              const admin = admins.find(({ _id }) => _id === id);
              return admin ? admin.name.split(' ')[0] : 'Personne';
            })
            .join(', ')
        }
        displayEmpty
      />

      <Select
        label="Étape du dossier"
        value={step ? step.$in : []}
        multiple
        options={[
          { id: null, label: 'Tous' },
          ...STEP_ORDER.map(s => ({
            id: s,
            label: <T id={`Forms.step.${s}`} />,
          })),
        ]}
        onChange={(_, values) => {
          if (values.includes(null)) {
            dispatch({
              type: ACTIONS.SET_FILTER,
              payload: { name: 'step', value: undefined },
            });
          } else {
            dispatch({
              type: ACTIONS.SET_FILTER,
              payload: { name: 'step', value: { $in: values } },
            });
          }
        }}
        renderValue={(selected) => {
          if (selected.length === 0 || selected.length === STEP_ORDER.length) {
            return 'Toutes';
          }
          return selected.map(s => f({ id: `Forms.step.${s}` }));
        }}
        displayEmpty
      />
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
