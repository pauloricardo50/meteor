import Lenders from '../../lenders';
import Tasks from '../../tasks';
import Users from '../../users';
import LoanService from './LoanService';

LoanService.cacheField(
  {
    cacheField: 'structureCache',
    fields: ['structures', 'selectedStructure'],
    transform({ structures = [], selectedStructure }) {
      return selectedStructure
        ? structures.find(({ id }) => id === selectedStructure)
        : undefined;
    },
  },
  // {
  //   structureCache: { $exists: false },
  //   selectedStructure: { $exists: true },
  //   $nor: [{ structures: { $exists: false } }, { structures: { $size: 0 } }],
  // },
);

LoanService.cache(
  {
    cacheField: 'userCache',
    type: 'one',
    collection: Users,
    fields: {
      _id: 1,
      firstName: 1,
      lastName: 1,
      referredByOrganisationLink: 1,
      referredByUserLink: 1,
      assignedEmployeeCache: 1,
    },
    referenceField: 'userId',
  },
  // {},
);

LoanService.cache(
  {
    cacheField: 'tasksCache',
    collection: Tasks,
    type: 'inversed',
    fields: {
      createdAt: 1,
      dueAt: 1,
      status: 1,
      title: 1,
      isPrivate: 1,
      assigneeLink: 1,
    },
    referenceField: 'loanLink._id',
  },
  // { tasksCache: { $exists: false } },
);

LoanService.cache(
  {
    cacheField: 'lendersCache',
    collection: Lenders,
    type: 'inversed',
    fields: { status: 1, contactLink: 1, organisationLink: 1, offersCache: 1 },
    referenceField: 'loanLink._id',
  },
  // {
  // $nor: [
  //   { lendersCache: { $exists: false } },
  //   { lendersCache: { $size: 0 } },
  // ],
  // 'lendersCache.offersCache': { $exists: false },
  // },
);
