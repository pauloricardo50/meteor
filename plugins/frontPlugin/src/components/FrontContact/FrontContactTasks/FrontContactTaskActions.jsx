import React from 'react';
import IconButton from '../../../core/components/IconButton';
import { TASK_STATUS } from '../../../core/api/tasks/taskConstants';
import EpotekFrontApi from '../../../EpotekFrontApi';

const FrontContactTaskActions = ({
  taskId,
  refetch = () => {},
  size = 'small',
}) => (
  <div className="flex" style={{ flexWrap: 'nowrap' }}>
    <IconButton
      onClick={e => {
        e.stopPropagation();
        EpotekFrontApi.callMethod('taskComplete', { taskId }).then(() =>
          refetch(),
        );
      }}
      size={size}
      type="check"
      tooltip="Compléter tâche"
      className="success"
    />
    <IconButton
      onClick={e => {
        e.stopPropagation();
        EpotekFrontApi.callMethod('taskChangeStatus', {
          taskId,
          newStatus: TASK_STATUS.CANCELLED,
        }).then(() => refetch());
      }}
      size={size}
      type="close"
      tooltip="Annuler tâche"
      className="error"
    />
  </div>
);

export default FrontContactTaskActions;
