import React from 'react';

import Linkify from '../../../core/components/Linkify/Linkify';
import FrontContactTaskActions from './FrontContactTaskActions';
import { formatDateTime } from './FrontContactTasks';
import { employeesById } from '../../../core/arrays/epotekEmployees';

const { Front } = window;

const FrontContactTask = ({ task, refetch }) => {
  const { description, dueAt, assignee } = task;

  return (
    <Linkify onClick={href => Front.openUrl(href)}>
      <hr style={{ width: '100%' }} />
      <div className="front-contact-task">
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
      <hr style={{ width: '100%' }} />
      <p style={{ whiteSpace: 'pre-wrap' }}>{description}</p>
    </Linkify>
  );
};

export default FrontContactTask;
