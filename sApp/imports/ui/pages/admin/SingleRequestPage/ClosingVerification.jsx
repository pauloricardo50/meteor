import React, { Component } from 'react';
import PropTypes from 'prop-types';

import cleanMethod from 'core/api/cleanMethods';

import FileVerificator from './FileVerificator';
import ItemVerificator from './ItemVerificator';

export default class ClosingVerification extends Component {
  setStatus = (id, newStatus) => {
    const { loanRequest } = this.props;
    const steps = loanRequest.logic.closingSteps;
    const step = steps.find(s => s.id === id);

    cleanMethod(
      'updateRequest',
      {
        'logic.closingSteps': [
          ...steps.filter(s => s.id !== id),
          { ...step, status: newStatus },
        ],
      },
      loanRequest._id,
    );
  };

  saveError = (id, error) => {
    const { loanRequest } = this.props;
    const steps = loanRequest.logic.closingSteps;
    const step = steps.find(s => s.id === id);

    cleanMethod(
      'updateRequest',
      {
        'logic.closingSteps': [
          ...steps.filter(s => s.id !== id),
          { ...step, error },
        ],
      },
      loanRequest._id,
    );
  };

  render() {
    const { loanRequest } = this.props;
    const steps = loanRequest.logic.closingSteps;
    return (
      <div style={{ padding: '0 16px' }}>
        {steps && steps.length ? (
          steps.map(
            step =>
              (step.type === 'upload' ? (
                <FileVerificator
                  currentValue={loanRequest.files[step.id]}
                  id={step.id}
                  closingSteps={steps}
                  key={step.id}
                  docId={loanRequest._id}
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
              )),
          )
        ) : (
          <h3>Pas d'étapes à vérifier</h3>
        )}
      </div>
    );
  }
}

ClosingVerification.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
