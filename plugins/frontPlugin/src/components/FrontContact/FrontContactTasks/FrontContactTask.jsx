import React from 'react';

import Button from '../../../core/components/Button';
import Linkify from '../../../core/components/Linkify/Linkify';
import FrontContactTaskActions from './FrontContactTaskActions';
import { formatDateTime } from './FrontContactTasks';
import { employeesById } from '../../../core/arrays/epotekEmployees';

const { Front } = window;

const FrontContactTask = ({ task, handleClose, refetch }) => {
  const { description, dueAt, assignee } = task;

  return (
    <Linkify Front={window.Front} onClick={href => Front.openUrl(href)}>
      <div className="flex-col" style={{ alignItems: 'flex-start' }}>
        <Button outlined primary onClick={handleClose}>
          &lt; Back
        </Button>
        <div className="flex-row center-align sb" style={{ width: '100%' }}>
          {formatDateTime(dueAt)}
          <div className="flex-row center-align">
            {assignee?._id && (
              <img
                src={employeesById[assignee._id].src}
                width={25}
                height={25}
                style={{ borderRadius: '50%' }}
                alt={assignee.name}
              />
            )}
            <FrontContactTaskActions
              taskId={task._id}
              refetch={refetch}
              size="medium"
            />
          </div>
        </div>
      </div>
      <p style={{ whiteSpace: 'pre-wrap' }}>{description}</p>
    </Linkify>
  );
};

export default FrontContactTask;
