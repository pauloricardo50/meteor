import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';

import cleanMethod from 'core/api/cleanMethods';

import Adder from './Adder';
import FileStep from './FileStep';
import TodoStep from './TodoStep';

// Return a new id for a step. Make sure the id's number is larger than all
// the current ones
const createId = (currentSteps, newType) => {
  const currentIds = currentSteps
    .filter(step => step.type === newType)
    .map(step => step.id);
  const currentCount = currentIds.length;
  const max = Math.max(
    ...currentIds.map(id => parseInt(id.replace(/[^0-9]/g, ''), 10)),
  );

  return newType + (max ? Math.max(currentCount, max + 1) : currentCount);
};

export default class ClosingStepsForm extends Component {
  constructor(props) {
    super(props);

    const { loanRequest } = this.props;

    this.state = {
      closingSteps:
        loanRequest.logic.closingSteps && loanRequest.logic.closingSteps.length
          ? loanRequest.logic.closingSteps
          : [],
    };
  }

  handleAdd = (type) => {
    this.setState(
      prev => ({
        closingSteps: [
          ...prev.closingSteps,
          { type, status: 'unverified', id: createId(prev.closingSteps, type) },
        ],
      }),
      // stupid fix because dialog is not resizing
      () => window.dispatchEvent(new Event('resize')),
    );
  };

  handleRemove = stepId =>
    this.setState(prev => ({
      closingSteps: prev.closingSteps.filter(step => step.id !== stepId),
    }));

  handleSave = () =>
    cleanMethod(
      'updateRequest',
      { 'logic.closingSteps': this.state.closingSteps },
      this.props.loanRequest._id,
    );

  handleChange = (stepId, key, value) =>
    this.setState(prev => ({
      closingSteps: [
        ...prev.closingSteps.filter(s => s.id !== stepId),
        { ...prev.closingSteps.find(s => s.id === stepId), [key]: value },
      ],
    }));

  render() {
    const { closingSteps } = this.state;
    const { loanRequest } = this.props;
    return (
      <article>
        <Adder handleAdd={this.handleAdd} />
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '40px 0' }}>
          {closingSteps
            .sort((a, b) => {
              if (a.id < b.id) return -1;
              if (a.id > b.id) return 1;
              return 0;
            })
            .map(
              (step, i) =>
                (step.type === 'todo' ? (
                  <TodoStep
                    step={step}
                    key={step.id}
                    onChange={this.handleChange}
                    handleRemove={this.handleRemove}
                  />
                ) : (
                  <FileStep
                    step={step}
                    key={step.id}
                    onChange={this.handleChange}
                    handleRemove={this.handleRemove}
                  />
                )),
            )}
        </div>
        <div className="text-center">
          <Button
            raised
            primary={
              JSON.stringify(loanRequest.logic.closingSteps) !==
              JSON.stringify(closingSteps)
            }
            label="Enregistrer"
            onClick={this.handleSave}
          />
        </div>
      </article>
    );
  }
}

ClosingStepsForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
