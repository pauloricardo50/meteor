import React from 'react';

export default class RequestProgressBar extends React.Component {

  progressClasses(stepNumber) {
    if (this.props.step < stepNumber) {
      return '';
    } else if (this.props.step === stepNumber) {
      return 'active';
    }
    return 'done';
  }

  render() {
    return (
      <header className="header-progressbar">
        <ul className="progressbar">
          <li className={this.progressClasses(0)} id="progressStep1">1</li>
          <li className={this.progressClasses(1)} id="progressStep2">2</li>
          <li className={this.progressClasses(2)} id="progressStep3">3</li>
          <li className={this.progressClasses(3)} id="progressStep4">4</li>
          <li className={this.progressClasses(4)} id="progressStep5"></li>
        </ul>
      </header>
    );
  }
}

RequestProgressBar.propTypes = {
  step: React.PropTypes.number.isRequired,
};
