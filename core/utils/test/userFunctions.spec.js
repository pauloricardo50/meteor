/* eslint-env mocha */
import { expect } from 'chai';

import { getUserDisplayName } from '../userFunctions';

describe('User Functions', () => {
  const firstName = 'firstName';
  const lastName = 'lastName';
  const username = 'username';
  const emails = [{ address: 'email@email.com' }];

  describe('getUserDisplayName', () => {
    it('should return an empty string when no arguments are passed', () => {
      expect(getUserDisplayName({})).to.equal('');
    });

    it("should return the user's names when they are defined", () => {
      expect(getUserDisplayName({ firstName, lastName })).to.equal(
        `${firstName} ${lastName}`,
      );
    });

    it('should return just the firstName when the lastName is undefined', () => {
      expect(getUserDisplayName({ firstName })).to.equal(firstName);
    });

    it('should return the email address when it is defined and the names and username are undefined', () => {
      expect(getUserDisplayName({ emails })).to.equal(emails[0].address);
    });
  });
});
