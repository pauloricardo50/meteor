import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';

export default class LastStepsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      information: [],
      admin: [],
    };
  }

  addValue = (type, value) => {
    this.setState(prevState => ({ [type]: [...prevState[type], value] }));
  };

  removeValue = (type, index) => {
    this.setState(prevState => ({
      [type]: prevState[type].filter((_, i) => i !== index),
    }));
  };

  render() {
    return (
      <section>
        <h1>Définir les dernières étapes</h1>
        <div>
          <h2>Ajouter des documents à uploader</h2>
        </div>

        <div>
          <h2>Ajouter des informations texte</h2>
        </div>

        <div>
          <h2>Ajouter des démarches administratives</h2>
        </div>
      </section>
    );
  }
}

LastStepsPage.propTypes = {};
