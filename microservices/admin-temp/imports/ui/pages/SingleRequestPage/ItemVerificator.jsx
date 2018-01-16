import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Select from 'core/components/Select';
import TextInput from 'core/components/TextInput';
import Button from 'core/components/Button';
import { FILE_STATUS } from 'core/api/constants';

const options = [
  { id: FILE_STATUS.UNVERIFIED, label: 'En attente' },
  { id: FILE_STATUS.VALID, label: 'Validé' },
  { id: FILE_STATUS.ERROR, label: 'Erreur' },
];

export default class ItemVerificator extends Component {
  constructor(props) {
    super(props);

    this.state = { error: this.props.item.error };
  }

  handleChange = (_, value) => this.setState({ error: value });

  render() {
    const { item, saveError, setStatus } = this.props;
    const { error } = this.state;

    return (
      <div className="flex-col" style={{ borderTop: '1px solid grey' }}>
        <div
          className="flex center"
          style={{ justifyContent: 'space-between' }}
        >
          {item.name && <h5 className="secondary bold">{item.name}</h5>}
          <Select
            value={item.status}
            onChange={setStatus}
            options={options}
            id={item.key}
            label="Statut"
          />
        </div>
        {item.status === FILE_STATUS.ERROR && (
          <div>
            <TextInput
              currentValue={error}
              onChange={this.handleChange}
              style={{ width: '100%' }}
              id={item.key}
              placeholder="Ajoutez une explication..."
            />
            <Button
              raised
              primary
              label="Enregistrer"
              onClick={() => saveError(item.key, error)}
              disabled={error === item.error}
              style={{ marginBottom: 8 }}
            />
          </div>
        )}
      </div>
    );
  }
}

ItemVerificator.propTypes = {
  item: PropTypes.objectOf(PropTypes.any).isRequired,
  saveError: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
};
