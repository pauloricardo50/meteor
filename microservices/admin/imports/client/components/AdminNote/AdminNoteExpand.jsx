// @flow
import React from 'react';
import { withState } from 'recompose';

import Button from 'core/components/Button';
import AdminNote from './AdminNote';

type AdminNoteExpandProps = {};

const AdminNoteExpand = ({
  showAll,
  setShowAll,
  ...props
}: AdminNoteExpandProps) => (
  <>
    <AdminNote
      {...props}
      style={{ height: showAll ? 'unset' : 120, overflow: 'hidden' }}
    />
    <Button
      style={{ marginTop: 16 }}
      primary
      outlined
      onClick={() => setShowAll(!showAll)}
    >
      {showAll ? 'Masquer' : 'Afficher tout'}
    </Button>
  </>
);

export default withState('showAll', 'setShowAll', false)(AdminNoteExpand);
