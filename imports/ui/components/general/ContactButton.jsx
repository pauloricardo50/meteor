import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ForumIcon from 'material-ui/svg-icons/communication/forum';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import MailIcon from 'material-ui/svg-icons/communication/mail-outline';
import PhoneIcon from 'material-ui/svg-icons/communication/call';

import colors from '/imports/js/config/colors';

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
    transition: 'all 0.2s ease-in-out',
    zIndex: -1,
    width: 240,
    height: 270,
    padding: 24,
    // display: 'flex',
    // flexDirection: 'column',
  },
  closed: {
    opacity: 0,
    height: 0,
    width: 0,
    right: 28,
    bottom: 28,
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

const overlayContent = (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <img
        src="/img/yannis.jpg"
        alt="Yannis"
        style={{ width: 64, height: 64, borderRadius: '50%', marginRight: 16 }}
      />
      <div className="text" style={{ flexGrow: 1 }}>
        <h4 className="fixed-size no-margin" style={{ marginBottom: 8 }}>Yannis Eggert</h4>
        <p className="secondary" style={{ margin: 0 }}>Votre conseiller</p>
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
        <PhoneIcon style={styles.icon} color="#495057" />
      </div>
      <div className="text" style={{ flexGrow: 1 }}>
        <p className="bold" style={{ margin: 0 }}>Par téléphone</p>
        <a href="tel:+41 78 709 31 31" className="active">+41 22 346 73 73</a>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={styles.iconDiv}>
        <MailIcon style={styles.icon} color="#495057" />
      </div>
      <div className="text" style={{ flexGrow: 1 }}>
        <p className="bold" style={{ margin: 0 }}>Par email</p>
        <a href="mailto:yannis@e-potek.ch" className="active">yannis@e-potek.ch</a>
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
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <div style={styles.div}>
        <FloatingActionButton
          style={styles.button}
          backgroundColor={colors.primary}
          onTouchTap={this.handleClick}
        >
          {this.state.open ? <CloseIcon /> : <ForumIcon />}
        </FloatingActionButton>
        <div
          className="mask1"
          // style={this.state.open ? styles.openedOverlay : styles.closedOverlay}
          style={{ ...styles.overlay, ...(this.state.open ? {} : styles.closed) }}
        >
          {overlayContent}
        </div>
      </div>
    );
  }
}

ContactButton.propTypes = {};
