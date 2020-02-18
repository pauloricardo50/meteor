import UserService from './UserService';

export const incoherentAssigneesResolver = () =>
  UserService.aggregate([
    { $project: { assignedEmployeeId: 1, firstName: 1, lastName: 1 } },
    {
      $lookup: {
        from: 'loans',
        localField: '_id',
        foreignField: 'userId',
        as: 'loans',
      },
    },
    {
      $project: {
        assignedEmployeeId: 1,
        'loans.assigneeLinks': 1,
        name: { $concat: ['$firstName', ' ', '$lastName'] },
      },
    },
    {
      // Remove all users that don't have loans
      $match: {
        $nor: [{ loans: { $exists: false } }, { loans: { $size: 0 } }],
      },
    },
    // Only match loans that have a single assignee
    { $match: { 'loans.assigneeLinks': { $size: 1 } } },
    {
      $project: {
        name: 1,
        assignedEmployeeId: 1,
        ids: {
          $reduce: {
            input: '$loans.assigneeLinks',
            initialValue: ['$assignedEmployeeId'],
            in: { $concatArrays: ['$$value', '$$this._id'] },
          },
        },
      },
    },
    {
      // Find users where assignedEmployeeId is not the same as the assigneeIds
      $project: {
        name: 1,
        assignedEmployeeId: 1,
        distinct: {
          $map: {
            input: '$ids',
            in: {
              $cond: {
                if: { $eq: ['$$this', { $arrayElemAt: ['$ids', 0] }] },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    },
    { $match: { distinct: 0 } },
  ]);
