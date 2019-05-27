// @flow
import React from 'react';
import ReactMarkdown from 'react-markdown';

import ClickToEditField from 'core/components/ClickToEditField';
import { updateDocument } from 'core/api/methods/index';

type AdminNoteProps = {};

const AdminNote = ({
  adminNote,
  docId,
  collection,
  placeholder,
}: AdminNoteProps) => (
  <ClickToEditField
    value={adminNote}
    onSubmit={value =>
      updateDocument.run({ collection, docId, object: { adminNote: value } })
    }
    placeholder={placeholder || '# Ajouter une note'}
    inputProps={{
      style: { width: '100%' },
      multiline: true,
      placeholder:
        '# Un titre - ## Un sous-titre - * liste - **En gras** - *En italique* -- "CMD + Enter" pour enregistrer',
    }}
  >
    {value => <ReactMarkdown source={value} />}
  </ClickToEditField>
);

export default AdminNote;
