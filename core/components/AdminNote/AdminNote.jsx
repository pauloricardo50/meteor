import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { updateDocument } from '../../api/methods/methodDefinitions';
import Button from '../Button';
import ClickToEditField from '../ClickToEditField';
import Icon from '../Icon';

const tutorial =
  '# Un titre - ## Un sous-titre - * liste - **En gras** - *En italique* -- "CMD + Enter" pour enregistrer';

const AdminNote = ({
  adminNote,
  docId,
  collection,
  placeholder,
  style,
  allowEditing,
  ...rest
}) => {
  const [displayFullNote, setDisplayFullNote] = useState(false);
  const displayedNote = displayFullNote ? adminNote : adminNote.slice(0, 400);
  return (
    <>
      <ClickToEditField
        value={displayedNote}
        onSubmit={value =>
          updateDocument.run({
            collection,
            docId,
            object: { adminNote: value },
          })
        }
        placeholder={allowEditing ? placeholder || '# Ajouter une note' : ''}
        inputProps={{
          style: { width: '100%' },
          multiline: true,
          placeholder: tutorial,
        }}
        style={style}
        allowEditing={allowEditing}
        onFocus={() => setDisplayFullNote(true)}
        onBlur={() => setDisplayFullNote(false)}
        {...rest}
      >
        {({ value, isEditing }) =>
          isEditing ? (
            <Icon type="help" tooltip={tutorial} />
          ) : (
            <div>
              <ReactMarkdown source={value} className="markdown" />
            </div>
          )
        }
      </ClickToEditField>
      <Button
        onClick={() => setDisplayFullNote(!displayFullNote)}
        label={displayFullNote ? 'Afficher moins' : 'Afficher plus'}
        primary
      />
    </>
  );
};

export default AdminNote;
