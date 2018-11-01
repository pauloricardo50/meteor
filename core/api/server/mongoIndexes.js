import { Loans, Borrowers, Offers, Properties, Tasks } from '..';

Loans._ensureIndex({ userId: 1 });
Borrowers._ensureIndex({ userId: 1 });
Offers._ensureIndex({ loanId: 1 });
Properties._ensureIndex({ userId: 1 });
Tasks._ensureIndex({ docId: 1 });
