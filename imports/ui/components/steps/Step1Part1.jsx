import React, { Component, PropTypes } from 'react';

import DropzoneInput from '/imports/ui/components/forms/DropzoneInput.jsx';

const styles = {
  mask: {
    marginBottom: 40,
  },
  p: {
    padding: 40,
  },
};

export default class Step1Part1 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="mask2" style={styles.mask}>
        <h3>Validez votre bien immobilier</h3>
        <p style={styles.p}>
          Nous voulons vérifier la légitimité de chaque dossier et donner une information claire
          aux banques concernant l'état de votre dossier.
        </p>
        <DropzoneInput
          fileName="housePicture"
          requestId={this.props.creditRequest._id}
        />
      </article>
    );
  }
}

Step1Part1.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
