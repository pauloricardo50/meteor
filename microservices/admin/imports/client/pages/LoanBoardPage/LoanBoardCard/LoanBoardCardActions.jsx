// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import DropdownMenu from 'core/components/DropdownMenu';
import LoanBoardCardActionsContainer from './LoanBoardCardActionsContainer';

type LoanBoardCardActionsProps = {};

const handleKeyDown = (e) => {
  if (e.keyCode === 13 && e.metaKey) {
    document
      .getElementById('task-form')
      .querySelector('[type="submit"]')
      .click();
  }
};

const LoanBoardCardActions = ({
  activitySchema,
  insertActivity,
  insertTask,
  openActivity,
  openTask,
  setOpenActivity,
  setOpenTask,
  taskSchema,
}: LoanBoardCardActionsProps) => (
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
          id: 'event',
          label: 'Ajouter événement',
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
      onClick={(event) => {
        // Prevent the loan from opening when clicking on the autoform
        event.stopPropagation();
      }}
      id="task-form"
      onSubmit={insertTask}
      setOpen={setOpenTask}
      title="Ajouter tâche"
      description="CMD + Enter pour enregistrer"
    />
    <AutoFormDialog
      noButton
      schema={activitySchema}
      open={openActivity}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        // Prevent the loan from opening when clicking on the autoform
        event.stopPropagation();
      }}
      id="activity-form"
      onSubmit={insertActivity}
      setOpen={setOpenActivity}
      title="Ajouter événement"
      description="CMD + Enter pour enregistrer"
    />
  </>
);

export default LoanBoardCardActionsContainer(LoanBoardCardActions);
