/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from 'core/utils/testHelpers';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import sinon from 'sinon';

import { setNewBorrowerNames } from '../../methodDefinitions';

describe('borrowers', () => {
  beforeEach(() => {
    resetDatabase();
    stubCollections();
  });

  afterEach(() => {
    stubCollections.restore();
  });

  describe('methods', () => {
    describe('setNewBorrowerNames', () => {
      let borrower;
      let user;
      const firstName = 'testFirstName';
      const lastName = 'testLastName';

      beforeEach(() => {
        borrower = Factory.create('borrower');
        user = Factory.create('user', { firstName, lastName });
        sinon.stub(Meteor, 'userId').callsFake(() => user._id);
      });

      afterEach(() => {
        Meteor.userId.restore();
      });

      it("it sets the borrowers first and last name if the user's first and last name are defined", () =>
        setNewBorrowerNames.run({ borrower, userId: user._id }).then((result) => {
          expect(result).to.include({ firstName, lastName });
        }));

      it("it doesn't modify the borrower if the user' firstName and lastName are not defined", () => {
        Meteor.users.update(
          { _id: user._id },
          { $unset: { firstName: '', lastName: '' } },
        );

        return setNewBorrowerNames
          .run({ borrower, userId: user._id })
          .then((result) => {
            expect(result)
              .to.deep.equal(borrower)
              .and.not.to.include({ firstName, lastName });
          });
      });

      it('it only adds on the borrower the user fields that are defined', () => {
        Meteor.users.update({ _id: user._id }, { $unset: { firstName: '' } });

        return setNewBorrowerNames
          .run({ borrower, userId: user._id })
          .then((result) => {
            borrower.lastName = lastName;
            expect(result)
              .to.deep.equal(borrower)
              .and.to.have.property('lastName')
              .and.not.to.have.property('firstName');
          });
      });
    });
  });
});
