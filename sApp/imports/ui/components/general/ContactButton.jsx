import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import track from '/imports/js/helpers/analytics';
import { T } from 'core/components/Translation';
import colors from '/imports/js/config/colors';
import supportStaff from '/imports/js/arrays/supportStaff';
import Icon from '/imports/ui/components/general/Icon';

const styles = {
  div: {
    position: 'fixed',
    right: 24,
    bottom: 24,
    zIndex: 20,
  },
  overlay: {
    boxShadow: '0 0 16px 0 rgba(33,37,41,0.16)',
    position: 'absolute',
    right: 0,
    bottom: 72,
    opacity: 1,
    transitionDelay: '500ms',
    transition: 'all 200ms ease-in-out',
    zIndex: -1,
    width: 240,
    height: 270,
    padding: 24,
  },
  closed: {
    opacity: 0,
    height: 0,
    width: 0,
  },
  iconDiv: {
    marginRight: 16,
    backgroundColor: '#DEE2E6',
    borderRadius: 4,
    height: 32,
    width: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
  },
};

const staff = supportStaff[0];

const overlayContent = path => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <img
        src={staff.img}
        alt={staff.fullName}
        style={{ width: 64, height: 64, borderRadius: '50%', marginRight: 16 }}
      />
      <div className="text" style={{ flexGrow: 1 }}>
        <h4 className="fixed-size no-margin" style={{ marginBottom: 8 }}>
          {staff.fullName}
        </h4>
        <p className="secondary" style={{ margin: 0 }}>
          <T id="ContactButton.yourAdvisor" />
        </p>
      </div>
    </div>
    <hr style={{ margin: '24px -24px' }} />
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <div style={styles.iconDiv}>
        <Icon type="phone" style={styles.icon} color="#495057" />
      </div>
      <div className="text" style={{ flexGrow: 1 }}>
        <p className="bold" style={{ margin: 0 }}>
          <T id="ContactButton.byPhone" />
        </p>
        <a
          href={`tel:${staff.phone}`}
          className="active"
          onClick={() => track('ContactButton - clicked on phone', { path })}
        >
          {staff.phone}
        </a>
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={styles.iconDiv}>
        <Icon type="mail" style={styles.icon} color="#495057" />
      </div>
      <div className="text" style={{ flexGrow: 1 }}>
        <p className="bold" style={{ margin: 0 }}>
          <T id="ContactButton.byEmail" />
        </p>
        <a
          href={`mailto:${staff.email}`}
          className="active"
          onClick={() => track('ContactButton - clicked on email', { path })}
        >
          {staff.email}
        </a>
      </div>
    </div>
  </div>
);

export default class ContactButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleClick = () => {
    // Track when the button is clicked
    if (!this.state.open) {
      track('ContactButton - clicked', {
        path: this.props.history.location.pathname,
      });
    }
    this.setState({ open: !this.state.open });
  };

  render() {
    const { open } = this.state;
    const { history } = this.props;

    return (
      <div style={styles.div}>
        <Button
          style={styles.button}
          onClick={this.handleClick}
          fab
          color="primary"
        >
          {open ? <Icon type="close" /> : <Icon type="forum" />}
        </Button>
        <div
          className="mask1"
          style={{
            ...styles.overlay,
            ...(open ? {} : styles.closed),
          }}
        >
          {overlayContent(history.location.pathname)}
        </div>
      </div>
    );
  }
}

ContactButton.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
