import { Factory } from 'meteor/dburles:factory';
import Tasks from '../../api/tasks/tasks';

export const generateData = (overrides = {}) => {
  const user = Factory.create('user', { ...overrides.user });
  const admin = Factory.create('admin', { ...overrides.admin });
  const borrower = Factory.create('borrower', {
    userId: user._id,
    ...overrides.borrowers,
  });
  const property = Factory.create('property', {
    userId: user._id,
    ...overrides.property,
  });
  const loan = Factory.create('loan', {
    userId: user._id,
    propertyId: property._id,
    borrowerIds: [borrower._id],
    ...overrides.loan,
  });
  const offer = Factory.create('offer', {
    loanId: loan._id,
    ...overrides.offers,
  });

  return {
    loan,
    user,
    admin,
    borrowers: [borrower],
    property,
    offers: [offer],
  };
};

export const generateTaskRelatedToAFile = (fileOverrides) => {
  const task = Factory.create('task');
  const { fileKey: taskFileKey, documentId: taskDocumentId } = task;

  const taskRelatedFile = { key: taskFileKey, ...fileOverrides };
  const taskRelatedDocuments = {
    [taskDocumentId]: {
      files: [taskRelatedFile],
    },
  };

  // inject a task's file (with it's document) in the borrower
  const borrowerId = Factory.create('borrower', {
    documents: taskRelatedDocuments,
  })._id;

  // build the relation between the task and borrower
  Tasks.update(task._id, { $set: { borrowerId } });

  // reload the task's data before returning it
  return Tasks.findOne(task);
};
