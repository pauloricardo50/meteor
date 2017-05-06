import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import getMountedComponent from '/imports/js/helpers/testHelpers';

import Start from '../auctionPage/Start.jsx';

if (Meteor.isClient) {
  describe('<AuctionPage />', () => {
    let props;
    const component = () => getMountedComponent(Start, props);

    beforeEach(() => {
      props = {
        loanRequest: {
          logic: {},
          property: {},
          general: {},
        },
        borrowers: [{}],
      };
      getMountedComponent.reset();
    });

    it('Renders correctly before auction', () => {
      expect(component().hasClass('mask1')).to.be.true;
    });
  });
}
