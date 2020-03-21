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

LoanService.migrateCache(
  { cacheField: 'userCache' },
  // { 'userCache.referredByUserLink': { $exists: false } },
);

LoanService.migrateCache(
  { cacheField: 'tasksCache' },
  // { tasksCache: { $exists: false } },
);

LoanService.migrateCache(
  { cacheField: 'lendersCache' },
  {
    // $nor: [
    //   { lendersCache: { $exists: false } },
    //   { lendersCache: { $size: 0 } },
    // ],
    // 'lendersCache.offersCache': { $exists: false },
  },
);
