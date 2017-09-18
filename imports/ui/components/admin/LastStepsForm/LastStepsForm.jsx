import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';

import cleanMethod from '/imports/api/cleanMethods';

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

export default class LastStepsForm extends Component {
  constructor(props) {
    super(props);

    const { loanRequest } = this.props;

    this.state = {
      lastSteps:
        loanRequest.logic.lastSteps && loanRequest.logic.lastSteps.length
          ? loanRequest.logic.lastSteps
          : [],
    };
  }

  handleAdd = (type) => {
    this.setState(
      prev => ({
        lastSteps: [
          ...prev.lastSteps,
          { type, status: 'unverified', id: createId(prev.lastSteps, type) },
        ],
      }),
      // stupid fix because dialog is not resizing
      () => window.dispatchEvent(new Event('resize')),
    );
  };

  handleRemove = stepId =>
    this.setState(prev => ({
      lastSteps: prev.lastSteps.filter(step => step.id !== stepId),
    }));

  handleSave = () =>
    cleanMethod(
      'updateRequest',
      { 'logic.lastSteps': this.state.lastSteps },
      this.props.loanRequest._id,
    );

  handleChange = (stepId, key, value) =>
    this.setState(
      prev => ({
        lastSteps: [
          ...prev.lastSteps.filter(s => s.id !== stepId),
          { ...prev.lastSteps.find(s => s.id === stepId), [key]: value },
        ],
      }),
      () => console.log(this.state),
    );

  render() {
    const { lastSteps } = this.state;
    const { loanRequest } = this.props;
    return (
      <article>
        <Adder handleAdd={this.handleAdd} />
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '40px 0' }}>
          {lastSteps
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
                    handleChange={this.handleChange}
                    handleRemove={this.handleRemove}
                  />
                ) : (
                  <FileStep
                    step={step}
                    key={step.id}
                    handleChange={this.handleChange}
                    handleRemove={this.handleRemove}
                  />
                )),
            )}
        </div>
        <div className="text-center">
          <Button
            raised
            primary={
              JSON.stringify(loanRequest.logic.lastSteps) !==
              JSON.stringify(lastSteps)
            }
            label="Enregistrer"
            onClick={this.handleSave}
          />
        </div>
      </article>
    );
  }
}

LastStepsForm.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
