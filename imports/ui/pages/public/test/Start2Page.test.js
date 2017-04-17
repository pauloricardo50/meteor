import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Start2Page from '../Start2Page.jsx';

if (Meteor.isClient) {
  describe('<Start2Page />', () => {
    let props;
    let mountedComponent;
    const component = () => {
      if (!mountedComponent) {
        mountedComponent = mount(<Start2Page {...props} />, {
          context: { muiTheme: getMuiTheme(myTheme) },
          childContextTypes: { muiTheme: PropTypes.object },
        });
      }
      return mountedComponent;
    };

    beforeEach(() => {
      props = {
        match: {
          params: {
            type: 'test',
          },
        },
        location: {
          search: '',
        },
      };

      mountedComponent = undefined;
    });

    it('Always renders a ux-text div', () => {
      const divs = component().find('div');

      expect(divs.length).to.be.at.least(1);
      expect(divs.first().hasClass('ux-text')).to.be.true;
    });
  });
}
