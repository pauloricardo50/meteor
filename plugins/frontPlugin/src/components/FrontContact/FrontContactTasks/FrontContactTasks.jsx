import React from 'react';
import moment from 'moment';
import Slide from '@material-ui/core/Slide';

import T from '../../../core/components/Translation';
import { employeesById } from '../../../core/arrays/epotekEmployees';
import FrontCardItem from '../../FrontCard/FrontCardItem';
import TableWithModal from '../../../core/components/Table/TableWithModal';
import FrontContactTask from './FrontContactTask';
import FrontContactTaskActions from './FrontContactTaskActions';

const now = moment();
export const formatDateTime = (date, toNow) => {
  const momentDate = moment(date);
  const text = date ? momentDate[toNow ? 'toNow' : 'fromNow']() : '-';

  if (momentDate.isBefore(now)) {
    return <span className="error-box">{text}</span>;
  }

  return text;
};

const columnOptions = [
  { id: 'title', label: <T id="TasksTable.title" />, style: { width: '200%' } },
  { id: 'dueAt', label: <T id="TasksTable.dueAt" /> },
  {
    id: 'assignedTo',
    label: ' ',
    style: { width: 50 },
  },
  { id: 'actions', label: ' ' },
];

const makeMapTask = ({ refetch }) => task => {
  const { _id: taskId, title, dueAt, assignee } = task;

  return {
    id: taskId,
    task,
    columns: [
      { raw: title || '-', label: <b>{title}</b> },
      { raw: dueAt, label: formatDateTime(dueAt) },
      {
        label: assignee?._id ? (
          <img
            src={employeesById[assignee._id].src}
            width={20}
            height={20}
            style={{ borderRadius: '50%' }}
            alt={assignee.name}
          />
        ) : null,
        raw: assignee?.name,
      },
      {
        raw: '',
        label: <FrontContactTaskActions taskId={taskId} refetch={refetch} />,
      },
    ],
  };
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const FrontContactTasks = ({ tasks = [], refetch }) => (
  <FrontCardItem label="Tâches">
    {tasks.length ? (
      <TableWithModal
        columnOptions={columnOptions}
        rows={tasks.map(makeMapTask({ refetch }))}
        className="front-contact-tasks"
        modalType="dialog"
        getModalProps={({ row: { task }, setOpen }) => ({
          title: task.title,
          fullScreen: true,
          children: (
            <FrontContactTask
              task={task}
              handleClose={() => setOpen(false)}
              refetch={refetch}
            />
          ),
        })}
        modalProps={{ actions: [], TransitionComponent: Transition }}
      />
    ) : (
      <p className="secondary mt-4">Aucune tâche pour l'instant</p>
    )}
  </FrontCardItem>
);

export default FrontContactTasks;
