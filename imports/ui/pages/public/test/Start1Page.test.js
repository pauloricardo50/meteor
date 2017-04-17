import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import { MemoryRouter } from 'react-router-dom';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Start1Page from '../Start1Page.jsx';

if (Meteor.isClient) {
  describe('<Start1Page />', () => {
    let props;
    let mountedComponent;
    const component = () => {
      if (!mountedComponent) {
        mountedComponent = mount(
          <MemoryRouter><Start1Page {...props} /></MemoryRouter>,
          {
            context: { muiTheme: getMuiTheme(myTheme) },
            childContextTypes: { muiTheme: PropTypes.object },
          },
        );
      }
      return mountedComponent;
    };

    beforeEach(() => {
      props = { match: { params: {} } };
      mountedComponent = undefined;
    });

    it('Always renders a section', () => {
      const sections = component().find('section');

      expect(sections.length).to.be.at.least(1);
      expect(sections.first().hasClass('oscar')).to.be.true;
    });
  });
}
