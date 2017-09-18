import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { Link } from 'react-router-dom';

import cleanMethod from '/imports/api/cleanMethods';
import { getWidth } from '/imports/js/helpers/browserFunctions';
import track from '/imports/js/helpers/analytics';
import { T } from '/imports/ui/components/general/Translation';

const styles = {
  button: {
    marginLeft: 8,
    animationIterationCount: 5,
  },
  smallButton: {
    minWidth: 'unset',
    width: 36,
    marginLeft: 8,
    animationIterationCount: 5,
  },
};

const handleNextStep = ({ stepNb, loanRequest, history, nextLink }) => {
  // increment step if this is the currentstep
  if (stepNb === loanRequest.logic.step) {
    cleanMethod('incrementStep', null, loanRequest._id).then(
      () => !!nextLink && history.push(nextLink),
    );
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
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => this.setState({ smallWidth: getWidth() < 768 });

  renderButtons = () => {
    const {
      stepNb,
      index,
      length,
      prevLink,
      currentStep,
      nextLink,
    } = this.props;
    const { smallWidth } = this.state;

    // remove previous button if this is the very first step
    const showBackButton = !(stepNb === 1 && index === 0);
    const lastPartOfStep = index === length - 1;

    const isDone = currentStep.isDone();

    return (
      <div className="buttons" key="someKey">
        {showBackButton && (
          <Button
            raised
            icon={smallWidth ? <ArrowLeft /> : undefined}
            label={smallWidth ? '' : <T id="ProcessPageBar.previous" />}
            style={smallWidth ? styles.smallButton : styles.button}
            disabled={!prevLink}
            containerElement={prevLink ? <Link to={prevLink} /> : undefined}
            onClick={() =>
              track('ProcessPageBar - clicked back', { to: prevLink })}
          />
        )}
        <Button
          raised
          labelPosition="before"
          icon={smallWidth || isDone ? <ArrowRight /> : undefined}
          label={
            smallWidth ? (
              ''
            ) : lastPartOfStep ? (
              <T id="ProcessPageBar.nextStep" />
            ) : (
              <T id="ProcessPageBar.next" />
            )
          }
          style={smallWidth ? styles.smallButton : styles.button}
          secondary={!!isDone}
          className={isDone ? 'animated pulse' : undefined}
          disabled={(lastPartOfStep && !isDone) || !nextLink}
          containerElement={
            nextLink && !lastPartOfStep ? <Link to={nextLink} /> : undefined
          }
          onClick={() => {
            track('ProcessPageBar - clicked next', {
              to: lastPartOfStep ? 'next step' : nextLink,
            });
            if (lastPartOfStep) {
              handleNextStep(this.props);
            }
          }}
        />
      </div>
    );
  };

  render() {
    // Hide buttons if the request is done
    const showButtons = this.props.status === 'active';

    return (
      <div className={this.props.className}>
        <h3 className="title fixed-size bold secondary">
          <T id={`steps.${this.props.currentStep.id}.title`} />
        </h3>
        {showButtons && this.renderButtons()}
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
  status: PropTypes.string,
};

ProcessPageBar.defaultProps = {
  prevLink: undefined,
  nextLink: undefined,
  status: 'active',
};
