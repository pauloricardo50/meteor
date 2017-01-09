import React, { Component, PropTypes } from 'react';
import Step1InitialForm from '/imports/ui/components/steps/Step1InitialForm.jsx';


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
        <h3>Mon Projet</h3>
        {/* <p style={styles.p}>
          Nous voulons vérifier la légitimité de chaque dossier et donner une information claire
          aux banques concernant l'état de votre dossier.
        </p> */}

        <p>dropzone contrat de financement/projet d'acte d'achat</p>
        <Step1InitialForm loanRequest={this.props.loanRequest} />
      </article>
    );
  }
}

Step1Part1.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
