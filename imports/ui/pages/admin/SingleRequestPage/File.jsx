import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from '/imports/ui/components/general/Select';
import TextInput from '/imports/ui/components/general/TextInput';
import Button from '/imports/ui/components/general/Button';

const options = [
  { id: 'unverified', label: 'En attente' },
  { id: 'valid', label: 'Validé' },
  { id: 'error', label: 'Erreur' },
];

export default class File extends Component {
  constructor(props) {
    super(props);

    this.state = { error: this.props.file.error };
  }

  handleChange = (_, value) => this.setState({ error: value });

  render() {
    const { file, saveError, setStatus } = this.props;
    const { error } = this.state;

    return (
      <div className="flex-col" style={{ borderTop: '1px solid grey' }}>
        <div
          className="flex center"
          style={{ justifyContent: 'space-between' }}
        >
          <h5 className="secondary bold">{file.name}</h5>
          <Select
            currentValue={file.status}
            onChange={setStatus}
            options={options}
            id={file.key}
            label="Statut"
          />
        </div>
        {file.status === 'error' && (
          <div>
            <TextInput
              currentValue={error}
              handleChange={this.handleChange}
              style={{ width: '100%' }}
              id={file.key}
              placeholder="Ajoutez une explication..."
            />
            <Button
              raised
              primary
              label="Enregistrer"
              onClick={() => saveError(file.key, error)}
              disabled={error === file.error}
              style={{ marginBottom: 8 }}
            />
          </div>
        )}
      </div>
    );
  }
}

File.propTypes = {
  file: PropTypes.objectOf(PropTypes.any).isRequired,
  saveError: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
};
