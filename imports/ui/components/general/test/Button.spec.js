/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Button from '../Button.jsx';

describe('Button', () => {
  const wrapper = props => shallow(<Button {...props} />);

  test('renders', () => {
    expect(wrapper().exists()).toBe(true);
  });

  test('renders a FlatButton', () => {
    expect(wrapper().find(FlatButton).exists()).toBeTruthy();
    expect(wrapper().find(RaisedButton).exists()).toBeFalsy();
  });

  test('renders a RaisedButton', () => {
    expect(wrapper({ raised: true }).find(FlatButton).exists()).toBeFalsy();
    expect(wrapper({ raised: true }).find(RaisedButton).exists()).toBeTruthy();
  });
});
