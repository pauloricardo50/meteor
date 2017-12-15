import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from 'core/components/Button';
import AutoComplete from '/imports/ui/components/general/AutoComplete';
import Select from '/imports/ui/components/general/Select';

import { injectIntl } from 'react-intl';
import shuffle from 'lodash/shuffle';
import MuiDialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';

import { T } from 'core/components/Translation';

const types = ['boolean', 'number', 'money', 'date', 'text', 'percent'];

const suggestions = [
  { id: 'rooms', type: 'number' },
  { id: 'pool', type: 'boolean' },
  { id: 'washingMachine', type: 'boolean' },
  { id: 'parkingSpots', type: 'number' },
  { id: 'garage', type: 'boolean' },
  { id: 'summerTemperature', type: 'number' },
  { id: 'constructionYear', type: 'date' },
  { id: 'floor', type: 'number' },
  { id: 'floors', type: 'number' },
  { id: 'groundFloor', type: 'boolean' },
  { id: 'facing', type: 'text' },
  { id: 'garden', type: 'boolean' },
  { id: 'attic', type: 'boolean' },
  { id: 'terrace', type: 'boolean' },
  { id: 'balcony', type: 'boolean' },
  { id: 'basement', type: 'boolean' },
  { id: 'landArea', type: 'number' },
  { id: 'surface', type: 'number' },
  { id: 'dishwasher', type: 'boolean' },
  { id: 'chimney', type: 'boolean' },
  { id: 'renovationRequired', type: 'money' },
  { id: 'extensionAllowed', type: 'boolean' },
  { id: 'internetSpeed', type: 'number' },
  { id: 'haunted', type: 'boolean' },
  { id: 'landingRunway', type: 'boolean' },
  { id: 'contact', type: 'text' },
  { id: 'richNeighbours', type: 'boolean' },
  { id: 'biscuitHouse', type: 'boolean' },
];

class CustomFieldAdder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      randomSuggestions: shuffle(suggestions),
      type: '',
      open: false,
    };
  }

  handleOpen = () => this.setState({ open: true });
  handleClose = () => this.setState({ open: false });

  handleChange = (key, value) => this.setState({ [key]: value });

  handleSubmit = (event) => {
    const { type, name } = this.state;
    event.preventDefault();
    if (type && name) {
      this.props.addCustomField(name, type, this.handleClose);
    }
  };

  render() {
    const { name, type: currentType, randomSuggestions, open } = this.state;
    const f = this.props.intl.formatMessage;

    return (
      <div>
        <Button raised primary dense label="+" onClick={this.handleOpen} />
        <MuiDialog
          open={open}
          onRequestClose={this.handleClose}
          // Reset fields
          onExited={() => this.setState({ name: '', type: '' })}
        >
          <DialogTitle>
            <T id="CustomFieldAdder.title" />
          </DialogTitle>
          {/* overflow to allow autocomplete to display its results */}
          <DialogContent style={{ overflow: 'visible' }}>
            <form
              action="submit"
              onSubmit={this.handleSubmit}
              style={{ padding: 16 }}
            >
              <AutoComplete
                label={<T id="CustomFieldAdder.name" />}
                value={name}
                onChange={event =>
                  this.handleChange('name', event.target.value || '')}
                onSelect={({ type, label }) => {
                  this.handleChange('type', type);
                  this.handleChange('name', label);
                  Meteor.defer(() =>
                    this.setState({ randomSuggestions: shuffle(suggestions) }),
                  );
                }}
                suggestions={randomSuggestions.map(suggestion => ({
                  label: f({ id: `CustomFieldAdder.${suggestion.id}` }),
                  value: suggestion.id,
                  type: suggestion.type,
                }))}
                // filter={(suggestion, inputValue) =>
                //   suggestion.label.toLowerCase().slice(0, inputValue.length) ===
                //   inputValue}
              />

              <Select
                id="CustomFieldAdder.type"
                label={<T id="CustomFieldAdder.type" />}
                value={currentType}
                onChange={(_, value) => this.handleChange('type', value)}
                options={types.map(type => ({
                  id: type,
                  label: <T id={`CustomFieldAdder.${type}`} />,
                }))}
                style={{ marginTop: 32 }}
                renderValue={v => <T id={`CustomFieldAdder.${v}`} />}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              label={<T id="general.cancel" />}
              onClick={this.handleClose}
            />
            <Button
              primary
              label={<T id="CustomFieldAdder.add" />}
              onClick={this.handleSubmit}
              disabled={!(currentType && name)}
            />
          </DialogActions>
        </MuiDialog>
      </div>
    );
  }
}

CustomFieldAdder.propTypes = {
  addCustomField: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

CustomFieldAdder.defaultProps = {
  handleClose: undefined,
};

export default injectIntl(CustomFieldAdder);
