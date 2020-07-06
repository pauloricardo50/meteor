/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { incoherentAssigneesResolver } from '../resolvers';

describe('incoherentAssigneesResolver', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('returns no users if there are no assignees', () => {
    generator({
      users: [{}, {}],
    });

    const result = incoherentAssigneesResolver();
    expect(result.length).to.equal(0);
  });

  it('returns an incoherent user', () => {
    generator({
      users: [
        {},
        {
          assignedEmployee: { _id: 'admin1' },
          loans: { assignees: { _id: 'admin2' } },
        },
      ],
    });

    const result = incoherentAssigneesResolver();
    expect(result.length).to.equal(1);
  });

  it('does not return non-incoherent users', () => {
    generator({
      users: [
        {},
        {
          assignedEmployee: { _id: 'admin1' },
          loans: [
            { assignees: { _id: 'admin2' } },
            { assignees: { _id: 'admin1' } },
          ],
        },
      ],
    });

    const result = incoherentAssigneesResolver();
    expect(result.length).to.equal(0);
  });
});
