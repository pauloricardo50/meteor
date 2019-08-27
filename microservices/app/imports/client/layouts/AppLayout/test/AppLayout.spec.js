// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Roles } from 'meteor/alanning:roles';

import { getRedirect } from '../AppLayoutContainer';

describe('AppLayout', () => {
  describe('getRedirect', () => {
    context('when user is logged out', () => {
      it('should redirect to login', () => {
        expect(getRedirect(undefined, '/account')).to.include('login');
        expect(getRedirect(undefined, '/whatever')).to.include('login');
      });
      
      it('should not redirect if user is on allowed route', () => {
      expect(getRedirect(undefined, '/')).to.equal(false);
        expect(getRedirect(undefined, '/login')).to.equal(false);
        expect(getRedirect(undefined, '/reset-password')).to.equal(false);
        expect(getRedirect(undefined, '/enroll-account')).to.equal(false);
      });

      it('should put the entire route in the path query param', () => {
        const path = '/hello-my-dude';
        expect(getRedirect(undefined, path)).to.include('login');
        expect(getRedirect(undefined, path)).to.include(path);
      });
    });

    context('when user is logged in', () => {
      it('does not redirect if user is dev', () => {
        sinon.stub(Roles, 'userIsInRole').callsFake(() => true);
        expect(getRedirect({}, 'path')).to.equal(false);
        Roles.userIsInRole.restore();
      });

      it('redirects the user to / if no loans exist', () => {
        expect(getRedirect({ loans: [] }, '/whatever')).to.equal('/');
        expect(getRedirect({}, '/whatever')).to.equal('/');
      });

      it('does not redirect if user is on allowed route without loans', () => {
        expect(getRedirect({ loans: [] }, '/account')).to.equal(false);
        expect(getRedirect({ loans: [] }, '/enroll-account')).to.equal(false);
      });

      it('does not redirect if loans exist', () => {
        expect(getRedirect({ loans: [{}] }, '/whatever')).to.equal(false);
        expect(getRedirect({ loans: [{}] }, '/loans')).to.equal(false);
        expect(getRedirect({ loans: [{}] }, '/properties')).to.equal(false);
      });
    });
  });
});
