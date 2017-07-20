import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from '/imports/ui/components/general/Button.jsx';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { injectIntl } from 'react-intl';
import shuffle from 'lodash/shuffle';

import { T } from '/imports/ui/components/general/Translation.jsx';

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
    this.state = { randomSuggestions: shuffle(suggestions) };
  }

  handleChange = (key, value) => this.setState({ [key]: value });

  handleSubmit = () =>
    this.props.addCustomField(
      this.state.name,
      this.state.type,
      this.props.handleClose,
    );

  render() {
    const { name, type: currentType, randomSuggestions } = this.state;
    const f = this.props.intl.formatMessage;

    return (
      <div className="flex-col center">
        <AutoComplete
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          floatingLabelText={<T id="CustomFieldAdder.name" />}
          searchText={name}
          onUpdateInput={(value) => {
            this.handleChange('name', value);
          }}
          onNewRequest={(chosenRequest, index) => {
            const type = randomSuggestions[index].type;
            this.handleChange('type', type);
          }}
          openOnFocus
          dataSource={randomSuggestions.map(suggestion => ({
            text: f({ id: `CustomFieldAdder.${suggestion.id}` }),
            value: suggestion.id,
          }))}
          filter={AutoComplete.fuzzyFilter}
          menuCloseDelay={0}
          maxSearchResults={5}
          // Use defer to make sure suggestions are shuffled again only
          // after all changes have been made
          onClose={() =>
            Meteor.defer(() =>
              this.setState({ randomSuggestions: shuffle(suggestions) }),
            )}
        />

        <SelectField
          floatingLabelText={<T id="CustomFieldAdder.type" />}
          value={currentType}
          onChange={(event, key, value) => this.handleChange('type', value)}
        >
          <MenuItem value={null} />
          {types.map(type =>
            (<MenuItem
              key={type}
              value={type}
              primaryText={<T id={`CustomFieldAdder.${type}`} />}
            />),
          )}
        </SelectField>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
          }}
        >
          <Button
            label={<T id="general.cancel" />}
            onTouchTap={this.props.handleClose}
          />
          <Button
            primary
            label={<T id="CustomFieldAdder.add" />}
            onTouchTap={this.handleSubmit}
            disabled={!(currentType && name)}
          />
        </div>
      </div>
    );
  }
}

CustomFieldAdder.propTypes = {
  handleClose: PropTypes.func,
  addCustomField: PropTypes.func.isRequired,
  intl: PropTypes.objectOf(PropTypes.any).isRequired,
};

CustomFieldAdder.defaultProps = {
  handleClose: undefined,
};

export default injectIntl(CustomFieldAdder);
