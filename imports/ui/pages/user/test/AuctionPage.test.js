import React from 'react';
import { Meteor } from 'meteor/meteor';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Start from '../auctionPage/Start.jsx';

if (Meteor.isClient) {
  describe('<AuctionPage />', () => {
    it('Renders correctly before auction', () => {
      const request = {
        logic: {},
      };
      const page = mount(<Start loanRequest={request} />, {
        context: { muiTheme: getMuiTheme(myTheme) },
        childContextTypes: { muiTheme: React.PropTypes.object },
      });

      expect(page.hasClass('mask1')).to.be.true;
    });
  });
}
