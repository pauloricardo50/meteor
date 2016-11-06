import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import TopNavDropdown from '/imports/ui/components/general/TopNavDropdown.jsx';


export default class RequestProgressBar extends React.Component {
  constructor(props) {
    super(props);
  }

  progressClasses(stepNumber) {
    if (this.props.creditRequest) {
      if (this.props.creditRequest.step < stepNumber) {
        return 'bold';
      } else if (this.props.creditRequest.step === stepNumber) {
        return 'bold active';
      }
      return 'bold done';
    }
    return 'bold';
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
            <li className={this.progressClasses(5)} id="progressStep6"></li>
          </ul>

          {/* Large screens only */}
          <div className="header-progress-menu hidden-xs">
            <TopNavDropdown public={false} />
          </div>

        </header>
      );
    }
    return null;
  }
}

RequestProgressBar.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any),
};
