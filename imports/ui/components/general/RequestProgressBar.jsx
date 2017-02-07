import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';


const styles = {
  logoDiv: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
  },
  logo: {
    position: 'relative',
    display: 'block',
    height: '40%',
    margin: 'auto',
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

export default class RequestProgressBar extends React.Component {
  constructor(props) {
    super(props);

    // Get the 6th char of the URL, which should be a number if it's a step
    this.state = {
      activeStep: '',
    };
  }

  componentDidMount() {
    this.setStep(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setStep(nextProps);
    }
  }

  setStep(propz) {
    if (propz.currentURL) {
      const step = propz.currentURL.charAt(5);

      if (!isNaN(step)) {
        this.setState({ activeStep: step - 1 });
      } else {
        this.setState({ activeStep: '' });
      }
    }
  }


  progressClasses(stepNumber) {
    const classes = this.activeClass(stepNumber);

    // During the first step, do not show the progress bar
    if (this.props.loanRequest.logic.step === 0) {
      return classes.concat('hidden');
    }

    if (this.props.loanRequest) {
      if (this.props.loanRequest.logic.step < stepNumber) {
        return classes.concat('hidden');
      } else if (this.props.loanRequest.logic.step === stepNumber) {
        return classes.concat('bold active');
      }
      return classes.concat('bold done');
    }
    return classes.concat('hidden');
  }

  activeClass(stepNumber) {
    return (stepNumber === this.state.activeStep) ? 'current ' : '';
  }


  routeToStep(stepNumber) {
    // TODO: Add logic to prevent people from going to a specified step if it hasn't been unlocked
    FlowRouter.go(`/step${stepNumber}`)
  }

  render() {
    // If the user hasn't created any request, render nothing
    if (this.props.loanRequest) {
      return (
        <header className="header-progressbar">
          <ul className="progressbar">
            <li className={this.progressClasses(0)} id="progressStep1" onClick={() => this.routeToStep(1)} />
            <li className={this.progressClasses(1)} id="progressStep2" onClick={() => this.routeToStep(2)} />
            <li className={this.progressClasses(2)} id="progressStep3" onClick={() => this.routeToStep(3)} />
            <li className={this.progressClasses(3)} id="progressStep4" onClick={() => this.routeToStep(4)} />
            <li className={this.progressClasses(4)} id="progressStep5" onClick={() => this.routeToStep(5)} />
            <li className={this.progressClasses(5)} id="progressStep6" onClick={() => this.routeToStep(6)} />
          </ul>

          {/* Large screens only */}
          <div className="header-progress-menu hidden-xs">
            <TopNavDropdown public={false} currentUser={this.props.currentUser} />
          </div>

          {
            this.props.loanRequest.logic.step <= 0 &&
            <div className="hidden-sm hidden-md hidden-lg" style={styles.logoDiv}>
              <img src="/img/logo_black.svg" alt="e-Potek" style={styles.logo} />
            </div>
          }

        </header>
      );
    }
    return (
      <header className="header-progressbar">

        {/* Large screens only */}
        <div className="header-progress-menu hidden-xs">
          <TopNavDropdown public={false} currentUser={this.props.currentUser} />
        </div>

      </header>
    );
  }
}

RequestProgressBar.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
  currentURL: PropTypes.string.isRequired,
  currentUser: PropTypes.objectOf(PropTypes.any),
};
