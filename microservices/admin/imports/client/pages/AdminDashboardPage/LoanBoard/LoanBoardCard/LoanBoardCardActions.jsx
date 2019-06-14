// @flow
import React from 'react';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import DropdownMenu from 'core/components/DropdownMenu';
import LoanBoardCardActionsContainer from './LoanBoardCardActionsContainer';

type LoanBoardCardActionsProps = {};

const LoanBoardCardActions = ({
  insertReminder,
  insertTask,
  schema,
  setOpenReminder,
  setOpenTask,
  openReminder,
  openTask,
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
      onClick={(event) => {
        // Prevent the loan from opening when clicking on the autoform
        event.stopPropagation();
      }}
      onSubmit={openReminder ? insertReminder : insertTask}
      onClose={() => {
        setOpenReminder(false);
        setOpenTask(false);
      }}
    />
  </>
);

export default LoanBoardCardActionsContainer(LoanBoardCardActions);
