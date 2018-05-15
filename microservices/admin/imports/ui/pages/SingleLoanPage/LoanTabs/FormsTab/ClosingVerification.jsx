import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CLOSING_STEPS_TYPE } from 'core/api/constants';
import { loanUpdate } from 'core/api';
import FileVerificator from './FileVerificator';
import ItemVerificator from './ItemVerificator';

export default class ClosingVerification extends Component {
  setStatus = (id, newStatus) => {
    const { loan } = this.props;
    const steps = loan.logic.closingSteps;
    const step = steps.find(s => s.id === id);

    loanUpdate.run({
      object: {
        'logic.closingSteps': [
          ...steps.filter(s => s.id !== id),
          { ...step, status: newStatus },
        ],
      },
      loanId: loan._id,
    });
  };

  saveError = (id, error) => {
    const { loan } = this.props;
    const steps = loan.logic.closingSteps;
    const step = steps.find(s => s.id === id);

    loanUpdate.run({
      object: {
        'logic.closingSteps': [
          ...steps.filter(s => s.id !== id),
          { ...step, error },
        ],
      },
      loanId: loan._id,
    });
  };

  render() {
    const { loan } = this.props;
    const steps = loan.logic.closingSteps;
    return (
      <div className="closing-verification" style={{ padding: '0 16px' }}>
        {steps && steps.length ? (
          steps.map(step =>
            (step.type === CLOSING_STEPS_TYPE.UPLOAD ? (
              <FileVerificator
                currentValue={loan.files[step.id]}
                id={step.id}
                closingSteps={steps}
                key={step.id}
                docId={loan._id}
              />
            ) : (
              <div
                className="mask1 flex-col"
                key={step.id}
                style={{ marginBottom: 8 }}
              >
                <h4>{step.title}</h4>
                <p>{step.description}</p>

                <ItemVerificator
                  item={{
                    key: step.id,
                    status: step.status,
                    error: step.error,
                  }}
                  setStatus={this.setStatus}
                  saveError={this.saveError}
                />
              </div>
            )))
        ) : (
          <h3>Pas d&apos;étapes à vérifier</h3>
        )}
      </div>
    );
  }
}

ClosingVerification.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
};
