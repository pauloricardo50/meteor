import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { Link } from 'react-router-dom';

import { DocHead } from 'meteor/kadira:dochead';
import cleanMethod from '/imports/api/cleanMethods';
import { getWidth } from '/imports/js/helpers/browserFunctions';

import { T } from '/imports/ui/components/general/Translation.jsx';

const styles = {
  button: {
    marginLeft: 8,
  },
  smallButton: {
    minWidth: 'unset',
    width: 36,
    marginLeft: 8,
  },
};

const handleNextStep = ({ stepNb, loanRequest, history, nextLink }) => {
  // increment step if this is the currentstep
  if (stepNb === loanRequest.logic.step) {
    cleanMethod('incrementStep', null, loanRequest._id, error => {
      if (!error && nextLink) {
        history.push(nextLink);
      }
    });
  } else {
    history.push(nextLink);
  }
};

export default class ProcessPageBar extends Component {
  constructor(props) {
    super(props);
    this.state = { smallWidth: getWidth() < 768 };
  }

  componentDidMount() {
    DocHead.setTitle(`${this.props.currentStep.title} | e-Potek`);
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({ smallWidth: getWidth() < 768 });
  };

  render() {
    // remove previous button if this is the very first step
    const showBackButton = !(this.props.stepNb === 1 && this.props.index === 0);
    const lastPartOfStep = this.props.index === this.props.length - 1;
    return (
      <div className={this.props.className}>
        <h3 className="title fixed-size bold secondary">{this.props.currentStep.title}</h3>
        <div className="buttons">
          {showBackButton &&
            <RaisedButton
              icon={this.state.smallWidth ? <ArrowLeft /> : undefined}
              label={this.state.smallWidth ? '' : <T id="ProcessPageBar.previous" />}
              style={this.state.smallWidth ? styles.smallButton : styles.button}
              disabled={!this.props.prevLink}
              containerElement={this.props.prevLink ? <Link to={this.props.prevLink} /> : undefined}
            />}
          <RaisedButton
            icon={this.state.smallWidth ? <ArrowRight /> : undefined}
            label={
              this.state.smallWidth
                ? ''
                : lastPartOfStep
                  ? <T id="ProcessPageBar.nextStep" />
                  : <T id="ProcessPageBar.next" />
            }
            style={this.state.smallWidth ? styles.smallButton : styles.button}
            secondary={this.props.currentStep.isDone()}
            disabled={!this.props.nextLink || (lastPartOfStep && !this.props.currentStep.isDone())}
            containerElement={
              this.props.nextLink && !lastPartOfStep ? <Link to={this.props.nextLink} /> : undefined
            }
            onTouchTap={lastPartOfStep ? () => handleNextStep(this.props) : () => null}
          />
        </div>
      </div>
    );
  }
}

ProcessPageBar.propTypes = {
  className: PropTypes.string.isRequired,
  currentStep: PropTypes.objectOf(PropTypes.any).isRequired,
  stepNb: PropTypes.number.isRequired,
  prevLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  nextLink: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

ProcessPageBar.defaultProps = {
  prevLink: undefined,
  nextLink: undefined,
};
