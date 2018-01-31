import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import { Link } from 'react-router-dom';

import cleanMethod from 'core/api/cleanMethods';
import { getWidth } from 'core/utils/browserFunctions';
import track from 'core/utils/analytics';
import { T } from 'core/components/Translation';
import { REQUEST_STATUS } from 'core/api/constants';

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

const handleNextStep = ({
  stepNb, loan, history, nextLink,
}) => {
  // increment step if this is the currentstep
  if (stepNb === loan.logic.step) {
    cleanMethod('incrementStep', { id: loan._id }).then(() => !!nextLink && history.push(nextLink));
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

  getNextButtonChildren = (smallWidth, isDone, lastPartOfStep) => {
    let label;

    if (smallWidth) {
      label = null;
    } else if (lastPartOfStep) {
      label = <T id="ProcessPageBar.nextStep" />;
    } else {
      label = <T id="ProcessPageBar.next" />;
    }

    if (smallWidth || isDone) {
      return (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {label}
          <Icon type="right" style={{ marginLeft: 8 }} />
        </span>
      );
    }
    return label;
  };

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
    const disableNext = (lastPartOfStep && !isDone) || !nextLink;

    return (
      <div className="buttons" key="someKey">
        {showBackButton && (
          <Button
            raised
            icon={smallWidth ? <Icon type="left" /> : undefined}
            label={smallWidth ? '' : <T id="ProcessPageBar.previous" />}
            style={smallWidth ? styles.smallButton : styles.button}
            disabled={!prevLink}
            link={!!prevLink}
            to={prevLink}
            onClick={() =>
              track('ProcessPageBar - clicked back', { to: prevLink })
            }
          />
        )}
        <Button
          raised
          style={smallWidth ? styles.smallButton : styles.button}
          secondary={!!isDone}
          className={isDone && !disableNext ? 'animated pulse' : undefined}
          disabled={disableNext}
          link={nextLink && !lastPartOfStep}
          to={nextLink}
          onClick={() => {
            track('ProcessPageBar - clicked next', {
              to: lastPartOfStep ? 'next step' : nextLink,
            });
            if (lastPartOfStep) {
              handleNextStep(this.props);
            }
          }}
        >
          {this.getNextButtonChildren(smallWidth, isDone, lastPartOfStep)}
        </Button>
      </div>
    );
  };

  render() {
    // Hide buttons if the loan is done
    const showButtons = this.props.status === REQUEST_STATUS.ACTIVE;

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
};
