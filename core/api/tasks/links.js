import { Tasks, Users, Loans, Borrowers, Properties } from '../';

Tasks.addLinks({
  assignedUser: {
    field: 'assignedTo',
    collection: Users,
    type: 'one',
  },

  loan: {
    field: 'loanId',
    collection: Loans,
    type: 'one',
  },

  property: {
    field: 'propertyId',
    collection: Properties,
    type: 'one',
  },

  borrower: {
    field: 'borrowerId',
    collection: Borrowers,
    type: 'one',
  },

  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
});

// Tasks.addReducers({
//   relatedToLoan: {
//     body: {
//       borrower: { _id: 1 },
//       loan: { _id: 1 },
//       property: { _id: 1 },
//     },
//     reduce(task, params) {
//       console.log(params);
//       return (
//         (task.loan && task.loan._id === params.loanId) ||
//         (task.property && task.property._id === params.propertyId)
//       );
//     },
//   },
// });
