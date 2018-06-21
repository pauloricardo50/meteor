import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import steps from 'core/arrays/joyride';
import Joyride from 'react-joyride';

export default class UserJoyride extends Component {
  constructor(props) {
    super(props);

    this.state = {
      run: false,
    };
  }

  componentDidMount() {
    Meteor.setTimeout(() => this.setState({ run: true }), 2000);
  }

  render() {
    return (
      <Joyride
        ref={c => this.joyride = c}
        steps={steps}
        // autoStart
        run={this.state.run} // or some other boolean for when you want to start it
        // debug
        showOverlay
        showSkipButton
        showStepsProgress
        scrollToSteps
        type="continuous"
        locale={{
          back: 'Retour',
          close: 'Fermer',
          last: 'Terminer',
          next: 'Suivant',
          skip: 'Sauter',
        }}
      />
    );
  }
}

UserJoyride.propTypes = {};
