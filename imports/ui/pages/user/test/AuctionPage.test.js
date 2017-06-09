import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';

import AuctionStart from '../auctionPage/AuctionStart.jsx';

if (Meteor.isClient) {
  describe('<AuctionPage />', () => {
    let props;
    const component = () => getMountedComponent(AuctionStart, props);

    beforeEach(() => {
      getMountedComponent.reset();
      props = {
        loanRequest: Factory.create('loanRequest'),
        borrowers: [{}],
        serverTime: new Date(),
      };
    });

    it('Renders correctly before auction', () => {
      expect(component().hasClass('mask1')).to.be.true;
    });
  });
}
