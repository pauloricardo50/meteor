//      
/* eslint-env mocha */
import { expect } from 'chai';
import Snackbar from '@material-ui/core/Snackbar';

import getMountedComponent from 'core/utils/testHelpers/getMountedComponent';
import { DisconnectNotification } from '../DisconnectNotification';

describe('DisconnectNotification', () => {
  let props;
  const component = () =>
    getMountedComponent({
      Component: DisconnectNotification,
      props,
    });

  beforeEach(() => {
    getMountedComponent.reset();
    props = {};
  });

  it('is hidden by default', () => {
    props.status = { connected: true };

    expect(
      component()
        .find(Snackbar)
        .prop('open'),
    ).to.equal(false);
  });

  it('changes to open if a disconnection happens, after TIMEOUT', done => {
    props = { status: { connected: true }, timeout: 500 };
    expect(
      component()
        .find(Snackbar)
        .prop('open'),
    ).to.equal(false);

    props = { status: { connected: false }, timeout: 500 };

    component().setProps(props);

    component().update();

    expect(
      component()
        .find(Snackbar)
        .prop('open'),
    ).to.equal(false);

    setTimeout(() => {
      component().update();

      expect(
        component()
          .find(Snackbar)
          .prop('open'),
      ).to.equal(true);
      done();
    }, 600);
  });

  it('takes TIMEOUT to open if it starts disconnected, then changes back to closed instantly if connection is made', done => {
    props = { status: { connected: false }, timeout: 500 };
    component().update();

    setTimeout(() => {
      component().update();

      expect(
        component()
          .find(Snackbar)
          .prop('open'),
      ).to.equal(true);

      props = { status: { connected: true }, timeout: 500 };

      component().setProps(props);

      component().update();

      expect(
        component()
          .find(Snackbar)
          .prop('open'),
      ).to.equal(false);
      done();
    }, 600);
  });
});
