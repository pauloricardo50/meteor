import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Button from '/imports/ui/components/general/Button';
import Chip from 'material-ui/Chip';

import cleanMethod from '/imports/api/cleanMethods';
import { T } from '/imports/ui/components/general/Translation';

const fileIds = ['retirementWithdrawalStatement', 'asdf', 'dghkdsf'];

export default class LastStepsForm extends Component {
  constructor(props) {
    super(props);

    if (
      this.props.loanRequest.logic.lastSteps &&
      this.props.loanRequest.logic.lastSteps.length
    ) {
      this.state = {
        lastSteps: this.props.loanRequest.logic.lastSteps,
        selected: null,
      };
    } else {
      this.state = { lastSteps: [], selected: null };
    }
  }

  getFileIds = () => {
    const currentIds = this.state.lastSteps.map(step => step.id);
    return fileIds.filter(id => currentIds.indexOf(id) < 0);
  };

  handleAdd = () => {
    const type = 'file';
    const id = this.state.selected;
    this.setState(prev => ({
      lastSteps: [...prev.lastSteps, { id, type }],
      selected: null,
    }));
  };

  handleRemove = id =>
    this.setState(prev => ({
      lastSteps: prev.lastSteps.filter(step => step.id !== id),
    }));

  handleChange = (event, index, value) => this.setState({ selected: value });

  handleSave = () =>
    cleanMethod(
      'updateRequest',
      { 'logic.lastSteps': this.state.lastSteps },
      this.props.loanRequest._id,
    );

  render() {
    const { selected, lastSteps } = this.state;
    const { loanRequest } = this.props;
    return (
      <article>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DropDownMenu
            value={selected}
            onChange={this.handleChange}
            style={{ minWidth: 120 }}
          >
            <MenuItem value={null} />
            {this.getFileIds().map(id => (
              <MenuItem
                key={id}
                value={id}
                primaryText={<T id={`lastSteps.${id}`} />}
              />
            ))}
          </DropDownMenu>
          <Button
            raised
            label="Ajouter"
            onClick={this.handleAdd}
            disabled={!selected}
            primary
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '40px 0' }}>
          {lastSteps.map(step => (
            <Chip
              onRequestDelete={() => this.handleRemove(step.id)}
              key={step.id}
            >
              {<T id={`lastSteps.${step.id}`} />}
            </Chip>
          ))}
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
