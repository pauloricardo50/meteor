/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import getMountedComponent, {
  stubCollections,
} from '/imports/js/helpers/testHelpers';
import { Factory } from 'meteor/dburles:factory';

import AuctionStart from '../AuctionStart.jsx';

if (Meteor.isClient) {
  describe('<AuctionPage />', () => {
    let props;
    const component = () => getMountedComponent(AuctionStart, props);

    beforeEach(() => {
      stubCollections();
      getMountedComponent.reset();
      props = {
        loanRequest: Factory.create('loanRequest'),
        borrowers: [{}],
        serverTime: new Date(),
      };
    });

    afterEach(() => {
      stubCollections.restore();
    });

    it('Renders correctly before auction', () => {
      expect(component().hasClass('mask1')).to.equal(true);
    });
  });
}
