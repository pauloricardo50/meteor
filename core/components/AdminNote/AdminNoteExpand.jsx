import React from 'react';
import { withState } from 'recompose';

import Button from '../Button';
import AdminNote from './AdminNote';

const AdminNoteExpand = ({ showAll, setShowAll, adminNote, ...props }) => (
  <>
    <AdminNote
      {...props}
      adminNote={adminNote}
      style={{
        height: showAll || !adminNote ? 'unset' : 120,
        overflow: 'hidden',
      }}
    />
    {adminNote && (
      <Button
        style={{ marginTop: 16 }}
        primary
        outlined
        onClick={() => setShowAll(!showAll)}
      >
        {showAll ? 'Masquer' : 'Afficher tout'}
      </Button>
    )}
  </>
);

export default withState(
  'showAll',
  'setShowAll',
  ({ adminNote }) => !adminNote,
)(AdminNoteExpand);
