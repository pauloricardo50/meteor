import { SecurityService, getDocFromCollection } from '../..';
import { addFileToDoc, deleteFile } from '../methodDefinitions';

addFileToDoc.setHandler((context, { file, fileId, collection, docId }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  console.log('hi');
});

deleteFile.setHandler((context, { fileKey, fileId, collection, docId }) => {
  SecurityService[collection].isAllowedToUpdate(docId);
  console.log('yo');
});
