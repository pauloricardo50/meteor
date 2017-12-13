/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import {
  getMountedComponent,
  stubCollections,
} from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import AuctionStart from '../AuctionStart';

if (Meteor.isClient) {
  describe('<AuctionPage />', () => {
    describe('<AuctionStart />', () => {
      let props;
      let request;
      let userId;
      const component = () => getMountedComponent(AuctionStart, props);

      beforeEach(() => {
        resetDatabase();
        stubCollections();
        userId = Factory.create('user')._id;
        request = Factory.create('loanRequest', { userId });
        props = {
          loanRequest: request,
          borrowers: [{}],
          serverTime: new Date(),
        };
        getMountedComponent.reset();
      });

      afterEach(() => {
        stubCollections.restore();
      });

      it('Renders correctly before auction', () => {
        expect(component().exists()).to.equal(true);
      });
    });
  });
}
