import React from 'react';

import IconButton from '../../../core/components/IconButton';
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
  </div>
);

export default FrontContactTaskActions;
