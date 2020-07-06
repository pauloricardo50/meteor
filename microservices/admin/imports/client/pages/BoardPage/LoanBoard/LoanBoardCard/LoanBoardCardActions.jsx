import React, { useState } from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import DropdownMenu from 'core/components/DropdownMenu';

import { activityFormLayout } from '../../../../components/AdminTimeline/AdminActivityAdder';
import { taskFormLayout } from '../../../../components/TaskForm/taskFormHelpers';
import LoanBoardCardActionsContainer from './LoanBoardCardActionsContainer';

const handleKeyDown = e => {
  if (e.keyCode === 13 && e.metaKey) {
    document
      .getElementById('loan-card-form')
      .querySelector('[type="submit"]')
      .click();
  }
};

const LoanBoardCardActions = ({
  activitySchema,
  insertActivity,
  insertTask,
  taskSchema,
}) => {
  const [openTask, setOpenTask] = useState(false);
  const [openActivity, setOpenActivity] = useState(false);

  return (
    <>
      <DropdownMenu
        iconType="more"
        buttonProps={{
          size: 'small',
          className: 'more-button',
          iconProps: { fontSize: 'default' },
        }}
        options={[
          {
            id: 'task',
            label: 'Ajouter tâche',
            onClick: () => setOpenTask(true),
          },
          {
            id: 'activity',
            label: 'Ajouter activité',
            onClick: () => setOpenActivity(true),
          },
        ]}
        noWrapper
      />
      <AutoFormDialog
        noButton
        schema={taskSchema}
        open={openTask}
        onKeyDown={handleKeyDown}
        onClick={event => {
          // Prevent the loan from opening when clicking on the autoform
          event.stopPropagation();
        }}
        id="loan-card-form"
        onSubmit={insertTask}
        setOpen={setOpenTask}
        title="Ajouter tâche"
        description="CMD + Enter pour enregistrer"
        layout={taskFormLayout}
      />
      <AutoFormDialog
        noButton
        schema={activitySchema}
        open={openActivity}
        onKeyDown={handleKeyDown}
        onClick={event => {
          // Prevent the loan from opening when clicking on the autoform
          event.stopPropagation();
        }}
        id="loan-card-form"
        onSubmit={insertActivity}
        setOpen={setOpenActivity}
        title="Ajouter événement"
        description="CMD + Enter pour enregistrer"
        layout={activityFormLayout}
      />
    </>
  );
};
export default LoanBoardCardActionsContainer(LoanBoardCardActions);
