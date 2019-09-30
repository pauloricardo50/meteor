// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Snackbar from '@material-ui/core/Snackbar';

import getMountedComponent from 'core/utils/testHelpers/getMountedComponent';
import { DisconnectNotification } from '../DisconnectNotification';

describe.only('DisconnectNotification', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: DisconnectNotification,
      props,
    });

  beforeEach(() => {
    props = {};
  });

  it('is hidden by default', () => {
    props.status = { connected: true };

    expect(component()
      .find(Snackbar)
      .prop('open')).to.equal(false);
  });

  it('changes to open if a disconnection happens, after timeout ms', (done) => {
    props = { status: { connected: true }, timeout: 500 };
    expect(component()
      .find(Snackbar)
      .prop('open')).to.equal(false);

    props = { status: { connected: false }, timeout: 500 };

    component().setProps(props);

    component().update();

    expect(component()
      .find(Snackbar)
      .prop('open')).to.equal(false);

    setTimeout(() => {
      component().update();

      expect(component()
        .find(Snackbar)
        .prop('open')).to.equal(true);
      done();
    }, 600);
  });

  it('changes back to closed if connection is made', () => {
    props = { status: { connected: false } };
    component().update();
    expect(component()
      .find(Snackbar)
      .prop('open')).to.equal(true);

    props = { status: { connected: true } };

    component().setProps(props);

    component().update();

    expect(component()
      .find(Snackbar)
      .prop('open')).to.equal(false);
  });
});
