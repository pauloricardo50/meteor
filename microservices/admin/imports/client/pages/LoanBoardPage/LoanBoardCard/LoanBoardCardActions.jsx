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
  insertReminder,
  insertTask,
  schema,
  setOpenReminder,
  setOpenTask,
  openReminder,
  openTask,
}: LoanBoardCardActionsProps) => {
  const onSubmit = openReminder ? insertReminder : insertTask;
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
            id: 'reminder',
            label: 'Ajouter rappel',
            onClick: () => setOpenReminder(true),
          },
          {
            id: 'task',
            label: 'Ajouter tâche',
            onClick: () => setOpenTask(true),
          },
        ]}
        noWrapper
      />
      <AutoFormDialog
        noButton
        schema={schema}
        open={openReminder || openTask}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          // Prevent the loan from opening when clicking on the autoform
          event.stopPropagation();
        }}
        id="task-form"
        onSubmit={onSubmit}
        onClose={() => {
          setOpenReminder(false);
          setOpenTask(false);
        }}
      />
    </>
  );
};

export default LoanBoardCardActionsContainer(LoanBoardCardActions);
