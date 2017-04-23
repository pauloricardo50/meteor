import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router';
import Routes from './routes.jsx';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import PasswordPage from '/imports/ui/pages/public/PasswordPage.jsx';

describe('Router', () => {
  it('renders correct routes', () => {
    const wrapper = shallow(<Routes />);
    const pathMap = wrapper.find(Route).reduce((pMap, route) => {
      const routeProps = route.props();
      pMap[routeProps.path] = routeProps.component;
      return pMap;
    }, {});
    // { 'nurse/authorization' : NurseAuthorization, ... }

    expect(pathMap['']).to.equal(PasswordPage);
  });
});
