import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import Checkbox from 'material-ui/Checkbox';

import cleanMethod from '/imports/api/cleanMethods';
import DropzoneInput from '/imports/ui/components/forms/DropzoneInput.jsx';
import Step1TaxesForm from '/imports/ui/components/steps/Step1TaxesForm.jsx';


const styles = {
  mask: {
    marginBottom: 40,
  },
  p: {
    padding: 40,
  },
  checkbox: {
    marginBottom: 40,
  },
};


export default class Step1Part2 extends Component {
  constructor(props) {
    super(props);

    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck(event, isInputChecked) {
    // Save data to DB
    const object = {};
    object['logic.uploadTaxesLater'] = !isInputChecked;
    const id = this.props.loanRequest._id;

    cleanMethod('update', id, object);
  }

  render() {
    return (
      <article className="mask2" style={styles.mask}>
        <h3>Votre déclaration d'impôts</h3>
        <p style={styles.p}>
          Pour permettre aux établissements financiers de vous faire une offre très précise,
          nous pouvons leur faire savoir que vous nous avez déjà confié votre
          déclaration d'impôts, sans la leur montrer.
          <br />
          Sans cela, certains établissements refuseront de faire une offre,
          car ils considèreront que votre dossier n'est pas assez sérieux.
        </p>

        <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 secondary">
          <Checkbox
            checked={!this.props.loanRequest.logic.uploadTaxesLater}
            label="J'uploaderai ma déclaration d'impôts plus tard"
            style={styles.checkbox}
            onCheck={this.handleCheck}
          />
        </div>

        <div className="col-xs-12">
          {
            this.props.loanRequest.logic.uploadTaxesLater ?
              <DropzoneInput
                label=""
                id="borrowers.0.files.taxes"
                message="Déposez votre déclaration d'impôts ici"
                currentValue={this.props.loanRequest.borrowers[0].files.taxes}
                folderName="taxes"
                requestId={this.props.loanRequest._id}
              /> :
                <Step1TaxesForm loanRequest={this.props.loanRequest} />
          }
        </div>
      </article>
    );
  }
}

Step1Part2.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
