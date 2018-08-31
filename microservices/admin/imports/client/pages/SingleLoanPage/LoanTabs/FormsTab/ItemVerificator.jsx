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

    this.state = { message: this.props.item.message };
  }

  handleChange = (_, value) => this.setState({ message: value });

  render() {
    const { item, saveError, setStatus } = this.props;
    const { message } = this.state;

    return (
      <div className="item-verificator">
        {item.name && <h4 className="secondary bold">{item.name}</h4>}
        <Select
          value={item.status}
          onChange={setStatus}
          options={options}
          id={item.Key}
          label="Statut"
        />
        {item.status === FILE_STATUS.ERROR && (
          <React.Fragment>
            <TextInput
              value={message}
              onChange={this.handleChange}
              id={item.key}
              placeholder="Ajoutez une explication..."
            />
            <Button
              raised
              primary
              label="Enregistrer"
              onClick={() => saveError(item.Key, message)}
              disabled={message === item.message}
            />
          </React.Fragment>
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
