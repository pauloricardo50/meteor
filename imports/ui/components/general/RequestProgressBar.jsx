import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';


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
    let classes = this.activeClass(stepNumber);
    if (this.props.creditRequest) {
      if (this.props.creditRequest.logic.step < stepNumber) {
        return classes.concat('bold');
      } else if (this.props.creditRequest.logic.step === stepNumber) {
        return classes.concat('bold active');
      }
      return classes.concat('bold done');
    }
    return classes.concat('bold');
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
    if (this.props.creditRequest) {
      return (
        <header className="header-progressbar">
          <ul className="progressbar">
            <li className={this.progressClasses(0)} id="progressStep1" onClick={() => this.routeToStep(1)}></li>
            <li className={this.progressClasses(1)} id="progressStep2" onClick={() => this.routeToStep(2)}></li>
            <li className={this.progressClasses(2)} id="progressStep3" onClick={() => this.routeToStep(3)}></li>
            <li className={this.progressClasses(3)} id="progressStep4" onClick={() => this.routeToStep(4)}></li>
            <li className={this.progressClasses(4)} id="progressStep5" onClick={() => this.routeToStep(5)}></li>
            <li className={this.progressClasses(5)} id="progressStep6" onClick={() => this.routeToStep(6)}></li>
          </ul>

          {/* Large screens only */}
          <div className="header-progress-menu hidden-xs">
            <TopNavDropdown public={false} />
          </div>

        </header>
      );
    }
    return (
      <header className="header-progressbar">

        {/* Large screens only */}
        <div className="header-progress-menu hidden-xs">
          <TopNavDropdown public={false} />
        </div>

      </header>
    );
  }
}

RequestProgressBar.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
  currentURL: PropTypes.string.isRequired,
};
