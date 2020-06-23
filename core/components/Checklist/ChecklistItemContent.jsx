import React from 'react';

import Uploader from '../UploaderArray/Uploader';
import { useChecklistContext } from './ChecklistContext';

const ChecklistItemUploader = ({ itemId }) => {
  const { uploaderDoc } = useChecklistContext();
  const { _id: docId, documents, additionalDocuments } = uploaderDoc;

  const additionalDocument = additionalDocuments.find(
    ({ checklistItemId }) => checklistItemId === itemId,
  );

  if (!additionalDocument) {
    // This avoid a race condition where the additionalDocument is not
    // yet on the loan, after inserting a checklist item
    return null;
  }

  return (
    <Uploader
      doc={uploaderDoc}
      docId={docId}
      variant="simple"
      allowRequiredByAdmin={false}
      currentValue={documents?.[additionalDocument.id]}
      fileMeta={additionalDocument}
      showTop={false}
    />
  );
};

const ChecklistItemContent = ({ item }) => {
  const { id: itemId, title, description, requiresDocument } = item;

  return (
    <div style={{ flexGrow: 1, maxWidth: 300 }}>
      <h5 className="m-0">{title}</h5>
      {description && <p className="secondary m-0">{description}</p>}
      {requiresDocument && <ChecklistItemUploader itemId={itemId} />}
    </div>
  );
};

export default ChecklistItemContent;
