// @flow
import React from 'react';

import T from 'core/components/Translation';
import Select from 'core/components/Select';
import CheckboxList from 'core/components/Checkbox/CheckboxList';
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
      <CheckboxList
        value={assignedEmployeeId.$in}
        label="Conseiller"
        options={[
          { id: null, label: 'Personne' },
          ...admins.map(admin => ({
            id: admin._id,
            label: admin.firstName,
          })),
        ]}
        onChange={(values) => {
          dispatch({
            type: ACTIONS.SET_FILTER,
            payload: { name: 'assignedEmployeeId', value: { $in: values } },
          });
        }}
        className="checkbox-list"
        renderValue={(value, opts) =>
          value.map(id => opts.find(({ _id }) => _id === id).label).join(', ')
        }
      />

      <CheckboxList
        renderValue={(value, opts) =>
          value.map(id => opts.find(({ _id }) => _id === id).label).join(', ')
        }
        value={step ? step.$in : [null]}
        label="Étape du dossier"
        options={[
          { id: null, label: 'Tous' },
          ...STEP_ORDER.map(s => ({
            id: s,
            label: <T id={`Forms.step.${s}`} />,
          })),
        ]}
        onChange={(values) => {
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
        className="checkbox-list"
      />
    </div>
  );
};

export default injectIntl(LoanBoardOptions);
