import React from 'react';
import { Meteor } from 'meteor/meteor';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import { MemoryRouter } from 'react-router-dom';

import myTheme from '/imports/js/config/mui_custom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import HomePage from '../HomePage.jsx';

if (Meteor.isClient) {
  describe('<HomePage />', () => {
    let props;
    let mountedComponent;
    const component = () => {
      if (!mountedComponent) {
        mountedComponent = mount(
          <MemoryRouter><HomePage {...props} /></MemoryRouter>,
          {
            context: { muiTheme: getMuiTheme(myTheme) },
            childContextTypes: { muiTheme: React.PropTypes.object },
          },
        );
      }
      return mountedComponent;
    };

    beforeEach(() => {
      props = {
        currentUser: undefined,
      };
      mountedComponent = undefined;
    });

    it('Always renders a section', () => {
      const sections = component().find('template');

      expect(sections.length).to.be.at.least(1);
    });
  });
}
