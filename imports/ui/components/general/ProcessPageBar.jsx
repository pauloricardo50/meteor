import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

import cleanMethod from '/imports/api/cleanMethods';

const styles = {
  button: {
    marginLeft: 8,
  },
};

const handleNextStep = ({ currentStep, loanRequest, history, nextLink }) => {
  // increment step if this is the currentstep
  if (currentStep === loanRequest.logic.step) {
    cleanMethod('incrementStep', null, loanRequest._id, error => {
      if (!error && nextLink) {
        history.push(nextLink);
      }
    });
  } else {
    history.push(nextLink);
  }
};

const ProcessPageBar = props => {
  // index = 1 because the very first step is a fake one (pass the form)
  const showBackButton = !(props.stepNb === 0 && props.index === 1);
  const lastPartOfStep = props.index === props.length - 1;
  return (
    <div className={props.className}>
      <h3 className="title fixed-size bold secondary">{props.currentStep.title}</h3>
      <div className="buttons">
        {showBackButton &&
          <RaisedButton
            label="Précédent"
            style={styles.button}
            disabled={!props.prevLink}
            containerElement={props.prevLink ? <Link to={props.prevLink} /> : undefined}
          />}
        <RaisedButton
          label={lastPartOfStep ? 'Prochaine étape' : 'Suivant'}
          style={styles.button}
          secondary={props.currentStep.isDone()}
          disabled={!props.nextLink}
          containerElement={
            props.nextLink && !lastPartOfStep ? <Link to={props.nextLink} /> : undefined
          }
          onTouchTap={lastPartOfStep ? () => handleNextStep(props) : () => null}
        />
      </div>
    </div>
  );
};

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

export default ProcessPageBar;
