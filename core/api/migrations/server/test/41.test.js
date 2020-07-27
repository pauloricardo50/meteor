import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import {
  LOAN_STATUS,
  UNSUCCESSFUL_LOAN_REASONS,
} from '../../../loans/loanConstants';
import UserService from '../../../users/server/UserService';
import { USER_STATUS } from '../../../users/userConstants';
import { down, up } from '../41';

describe('Migration 41', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('does not initialize non USER status', async () => {
      generator({ users: [{ _factory: 'pro' }, { _factory: 'advisor' }] });

      await up();

      const users = UserService.fetch({}, { status: 1 });

      users.forEach(({ status }) => expect(status).to.equal(undefined));
    });

    it('initializes USER status to QUALIFIED', async () => {
      generator({ users: { _id: 'user', _factory: 'user' } });

      await up();

      const { status } = UserService.get('user', { status: 1 });

      expect(status).to.equal(USER_STATUS.QUALIFIED);
    });

    // All its loans should be UNSUCCESSFUL
    // and their unsuccessfulReason must be either CONTACT_LOSS_NO_ANSWER or CONTACT_LOSS_UNREACHABLE
    it('initializes USER status to LOST if its loans meets the conditions', async () => {
      generator({
        users: {
          _id: 'user',
          _factory: 'user',
          loans: [
            {
              status: LOAN_STATUS.UNSUCCESSFUL,
              unsuccessfulReason:
                UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_NO_ANSWER,
            },
            {
              status: LOAN_STATUS.UNSUCCESSFUL,
              unsuccessfulReason:
                UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_UNREACHABLE,
            },
          ],
        },
      });

      await up();

      const { status } = UserService.get('user', { status: 1 });

      expect(status).to.equal(USER_STATUS.LOST);
    });

    it('initializes USER status to QUALIFIED if its loans do not meet the conditions', async () => {
      generator({
        users: [
          {
            _factory: 'user',
            loans: [
              {
                status: LOAN_STATUS.UNSUCCESSFUL,
                unsuccessfulReason:
                  UNSUCCESSFUL_LOAN_REASONS.CONTACT_LOSS_NO_ANSWER,
              },
              {
                status: LOAN_STATUS.PENDING,
              },
            ],
          },
          {
            _factory: 'user',
            loans: [
              {
                status: LOAN_STATUS.UNSUCCESSFUL,
                unsuccessfulReason:
                  UNSUCCESSFUL_LOAN_REASONS.LEAD_LOST_OTHER_BROKER,
              },
            ],
          },
          {
            _factory: 'user',
            loans: [
              {
                status: LOAN_STATUS.ONGOING,
              },
            ],
          },
        ],
      });

      await up();

      const users = UserService.fetch({ status: 1 });

      users.forEach(({ status }) =>
        expect(status).to.equal(USER_STATUS.QUALIFIED),
      );
    });
  });

  describe('down', () => {
    it('unsets user status', async () => {
      generator({ users: { _id: 'user', status: USER_STATUS.QUALIFIED } });

      await down();

      const { status } = UserService.get('user', { status: 1 });

      expect(status).to.equal(undefined);
    });
  });
});
