//      
import React from 'react';
import ReactMarkdown from 'react-markdown';

import ClickToEditField from '../ClickToEditField';
import Icon from '../Icon';
import { updateDocument } from '../../api/methods/index';

                         

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
}                ) => (
  <ClickToEditField
    value={adminNote}
    onSubmit={value =>
      updateDocument.run({ collection, docId, object: { adminNote: value } })
    }
    placeholder={allowEditing ? placeholder || '# Ajouter une note' : ''}
    inputProps={{
      style: { width: '100%' },
      multiline: true,
      placeholder: tutorial,
    }}
    style={style}
    allowEditing={allowEditing}
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
);

export default AdminNote;
