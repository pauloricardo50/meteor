import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from 'core/components/Button';
import ConfirmButton from '/imports/ui/components/ConfirmButton';

import { T } from 'core/components/Translation';

export default class CompareColumnFooter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
    };
  }

  toggleButtons = () =>
    this.setState(prev => ({ showButtons: !prev.showButtons }));

  render() {
    const { showButtons } = this.state;
    const {
      deleteProperty,
      id,
      editing,
      startEditing,
      stopEditing,
      cancelEditing,
    } = this.props;

    return (
      <div className="flex-col center" style={{ flexWrap: 'nowrap' }}>
        <Button
          label={
            <T
              id={
                showButtons
                  ? 'CompareColumnFooter.hide'
                  : 'CompareColumnFooter.show'
              }
            />
          }
          onClick={() => {
            cancelEditing();
            this.toggleButtons();
          }}
          style={{ margin: '8px 0' }}
        />

        {showButtons &&
          <div className="flex-col center">
            <Button
              raised
              label={<T id={editing ? 'general.save' : 'general.modify'} />}
              style={{ margin: '8px 0' }}
              primary
              onClick={editing ? stopEditing : startEditing}
            />
            <ConfirmButton
              raised
              label={<T id="general.delete" />}
              style={{ margin: '8px 0' }}
              handleClick={() => deleteProperty(id)}
            />
          </div>}
      </div>
    );
  }
}

CompareColumnFooter.propTypes = {
  deleteProperty: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  editing: PropTypes.bool.isRequired,
  startEditing: PropTypes.func.isRequired,
  stopEditing: PropTypes.func.isRequired,
};
