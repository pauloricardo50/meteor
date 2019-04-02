import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { getCollectionNameFromIdField } from '../helpers';
import { TASK_TYPE, FILE_STATUS } from '../constants';

// check if the file related to the input task has been validated or invalidated
const userAddedFileTaskValidation = ({
  fileKey,
  documentId,
  loanId,
  borrowerId,
  propertyId,
}) => {
  const taskRelatedDocIds = {
    loanId,
    borrowerId,
    propertyId,
  };
  // find the name of the id field to which the task is related
  const docIdFieldName = Object.keys(taskRelatedDocIds).find(key => taskRelatedDocIds[key]);
  const collectionName = getCollectionNameFromIdField(docIdFieldName);
  const docId = loanId || borrowerId || propertyId;

  const taskRelatedDoc = Mongo.Collection.get(collectionName).findOne({
    _id: docId,
    [`documents.${documentId}.files`]: { $elemMatch: { key: fileKey } },
  });

  const relatedFile = taskRelatedDoc.documents[documentId].find(({ key }) => key === fileKey);
  return [FILE_STATUS.ERROR, FILE_STATUS.VALID].includes(relatedFile.status);
};

// TODO
const lenderChosenTaskValidation = task => true;

export const validateTask = (task) => {
  if (!task) {
    throw new Meteor.Error('no task in validateTask');
  }

  switch (task.type) {
  case TASK_TYPE.VERIFY: {
    // TODO
    return false;
  }
  case TASK_TYPE.LENDER_CHOSEN: {
    return lenderChosenTaskValidation(task);
  }
  case TASK_TYPE.CUSTOM: {
    return true;
  }
  case TASK_TYPE.USER_ADDED_FILE: {
    return userAddedFileTaskValidation(task);
  }
  default:
    return true;
  }
};
