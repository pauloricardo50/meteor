// @flow
import React from 'react';

import { employeesById } from 'core/arrays/epotekEmployees';
import { Percent } from 'core/components/Translation';
import Tooltip from 'core/components/Material/Tooltip';

type LoanAssigneesProps = {};

const LoanAssignees = ({ assigneeLinks }: LoanAssigneesProps) => {
  if (!assigneeLinks || assigneeLinks.length === 0) {
    return <div>Pas encore de répartition</div>;
  }

  return (
    <div className="flex">
      {assigneeLinks
        .sort(({ percent: p1 }, { percent: p2 }) => p2 - p1)
        .map(({ _id, percent, isMain }) => (
          <div key={_id} className="mr-16">
            <Tooltip
              title={
                <div>
                  <b>{employeesById[_id].name}</b>
                  {isMain && <span> - Conseiller principal</span>}
                  <br />
                  <i>
                    <Percent value={percent / 100} />
                  </i>
                </div>
              }
            >
              <img
                src={employeesById[_id].src}
                alt={employeesById[_id].name}
                style={{ width: 20, height: 20, borderRadius: '50%' }}
              />
            </Tooltip>
          </div>
        ))}
    </div>
  );
};

export default LoanAssignees;
