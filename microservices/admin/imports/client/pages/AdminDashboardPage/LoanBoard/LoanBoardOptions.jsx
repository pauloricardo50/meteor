// @flow
import React from 'react';

import Select from 'core/components/Select';
import { ACTIONS } from './loanBoardHelpers';

type LoanBoardOptionsProps = {};

const LoanBoardOptions = ({
  options,
  dispatch,
  admins,
}: LoanBoardOptionsProps) => {
  const { assignedEmployeeId } = options;
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
    </div>
  );
};

export default LoanBoardOptions;
