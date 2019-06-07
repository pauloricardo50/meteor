// @flow
import React from 'react';
import ReactMarkdown from 'react-markdown';

import ClickToEditField from 'core/components/ClickToEditField';
import Icon from 'core/components/Icon';
import { updateDocument } from 'core/api/methods/index';

type AdminNoteProps = {};

const tutorial = '# Un titre - ## Un sous-titre - * liste - **En gras** - *En italique* -- "CMD + Enter" pour enregistrer';

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
      placeholder: tutorial,
    }}
  >
    {({ value, isEditing }) =>
      (isEditing ? (
        <Icon type="help" tooltip={tutorial} />
      ) : (
        <ReactMarkdown source={value} />
      ))
    }
  </ClickToEditField>
);

export default AdminNote;
