import { Meteor } from 'meteor/meteor';

import React from 'react';

import AdminBoardCardTasks from './AdminBoardCardTasks';

const AdminBoardCardContent = ({
  boardCardContent: {
    description: BoardCardContentDescription,
    content: BoardCardContentContent = () => null,
  },
  data,
  renderComplex,
  ...props
}) => {
  const { nextDueTask, tasksCache: tasks } = data;

  return (
    <>
      <BoardCardContentDescription data={data} {...props} />
      <AdminBoardCardTasks
        nextDueTask={nextDueTask}
        renderComplex={renderComplex}
        tasks={tasks.filter(
          ({ isPrivate = false, assigneeLink: { _id: assigneeId } = {} }) =>
            isPrivate && assigneeId ? assigneeId === Meteor.userId() : true,
        )}
      />
      <BoardCardContentContent data={data} {...props} />
    </>
  );
};

export default AdminBoardCardContent;
