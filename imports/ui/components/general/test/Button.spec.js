/* eslint-env mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Button from '../Button.jsx';

describe('Button', () => {
  const wrapper = props => shallow(<Button {...props} />);

  it('renders', () => {
    expect(wrapper().exists()).to.equal(true);
  });

  it('renders a FlatButton', () => {
    expect(wrapper().find(FlatButton).exists()).to.equal(true);
    expect(wrapper().find(RaisedButton).exists()).to.equal(false);
  });

  it('renders a RaisedButton', () => {
    expect(wrapper({ raised: true }).find(FlatButton).exists()).to.equal(false);
    expect(wrapper({ raised: true }).find(RaisedButton).exists()).to.equal(
      true,
    );
  });
});
