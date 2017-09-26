import PropTypes from 'prop-types';
import React, { Component } from 'react';

// import SelectField from '/imports/ui/components/general/Material/SelectField';
// import MenuItem from '/imports/ui/components/general/Material/MenuItem';

import SavingIcon from './SavingIcon';
import FormValidator from './FormValidator';
import cleanMethod from '/imports/api/cleanMethods';
import { T } from '/imports/ui/components/general/Translation';

import Select from '/imports/ui/components/general/Select';

const styles = {
  div: {
    position: 'relative',
  },
  savingIcon: {
    position: 'absolute',
    top: 30,
    right: -30,
  },
};

export default class SelectFieldInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.currentValue || null,
      errorText: '',
      saving: false,
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // Prevent weird component rerenders, which break keyboard+mouse use of this component
  //   return (
  //     this.props.currentValue !== nextProps.currentValue ||
  //     this.state !== nextState
  //   );
  // }

  handleChange = (_, value) => this.setState({ value }, () => this.saveValue());

  saveValue = () => {
    const { id, updateFunc, documentId } = this.props;
    const { value } = this.state;
    const object = { [id]: value };

    cleanMethod(updateFunc, object, documentId)
      .then(() =>
        // on success, set saving briefly to true, before setting it to false again to trigger icon
        this.setState(
          { errorText: '', saving: true },
          this.setState({ saving: false }),
        ),
      )
      .catch(error =>
        this.setState({ saving: false, errorText: error.message }),
      );
  };

  mapOptions = () =>
    this.props.options.map(
      ({ id, intlId, intlValues, label, ...otherProps }) => ({
        label: label || (
          <T
            id={`Forms.${intlId || this.props.id}.${id}`}
            values={intlValues}
          />
        ),
        id,
        ...otherProps,
      }),
    );

  render() {
    const {
      style,
      label,
      disabled,
      options,
      noValidator,
      id,
      // intlid,
    } = this.props;
    const { value, saving, errorText } = this.state;

    return (
      <div style={{ ...styles.div, ...style }}>
        <Select
          id={id}
          label={label}
          value={value}
          handleChange={this.handleChange}
          style={{ ...style, marginBottom: 8 }}
          disabled={disabled}
          renderValue={val => this.mapOptions().find(o => o.id === val).label}
          options={this.mapOptions()}
        />
        <SavingIcon
          saving={saving}
          errorExists={errorText !== ''}
          style={styles.savingIcon}
        />
        {!noValidator && <FormValidator {...this.props} />}
      </div>
    );
  }
}

SelectFieldInput.propTypes = {
  label: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  documentId: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateFunc: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

SelectFieldInput.defaultProps = {
  currentValue: undefined,
  disabled: false,
};
