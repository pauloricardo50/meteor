import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Button from '/imports/ui/components/general/Button';
import AutoComplete from '/imports/ui/components/general/AutoComplete';
// import SelectField from '/imports/ui/components/general/Material/SelectField';
// import MenuItem from '/imports/ui/components/general/Material/MenuItem';
import Select from '/imports/ui/components/general/Select';

import { injectIntl } from 'react-intl';
import shuffle from 'lodash/shuffle';

import { T } from '/imports/ui/components/general/Translation';

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
          // anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          label={<T id="CustomFieldAdder.name" />}
          value={name}
          onChange={value => this.handleChange('name', value)}
          onSelect={(chosenRequest, index) => {
            console.log('fix this');
            const type = randomSuggestions[index].type;
            this.handleChange('type', type);
            Meteor.defer(() =>
              this.setState({ randomSuggestions: shuffle(suggestions) }),
            );
          }}
          // openOnFocus
          suggestions={randomSuggestions.map(suggestion => ({
            text: f({ id: `CustomFieldAdder.${suggestion.id}` }),
            value: suggestion.id,
          }))}
          // filter={AutoComplete.fuzzyFilter}
          // menuCloseDelay={0}
          // maxSearchResults={5}
          // Use defer to make sure suggestions are shuffled again only
          // after all changes have been made
          // onClose={() =>
          //   Meteor.defer(() =>
          //     this.setState({ randomSuggestions: shuffle(suggestions) }),
          //   )}
        />

        <Select
          label={<T id="CustomFieldAdder.type" />}
          value={currentType}
          onChange={(_, value) => this.handleChange('type', value)}
          options={types.map(type => ({
            id: type,
            label: <T id={`CustomFieldAdder.${type}`} />,
          }))}
        >
          {/* <MenuItem value={null} />
          {types.map(type => (
            <MenuItem
              key={type}
              value={type}
              primaryText={<T id={`CustomFieldAdder.${type}`} />}
            />
          ))} */}
        </Select>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignSelf: 'flex-end',
          }}
        >
          <Button
            label={<T id="general.cancel" />}
            onClick={this.props.handleClose}
          />
          <Button
            primary
            label={<T id="CustomFieldAdder.add" />}
            onClick={this.handleSubmit}
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
