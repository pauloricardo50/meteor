import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import Checkbox from 'material-ui/Checkbox';


import { updateValues } from '/imports/api/creditrequests/methods.js';
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
    object['files.willUploadTaxes'] = !isInputChecked;
    const id = this.props.creditRequest._id;

    updateValues.call({
      object, id,
    }, (error, result) => {
      if (error) {
        alert(error.message);
        throw new Meteor.Error(500, error.message);
      } else {
        return 'Update Successful';
      }
    });
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
            checked={!this.props.creditRequest.files.willUploadTaxes}
            label="J'uploaderai ma déclaration d'impôts plus tard"
            style={styles.checkbox}
            onCheck={this.handleCheck}
          />
        </div>

        <div className="col-xs-12">
          {
            this.props.creditRequest.files.willUploadTaxes ?
              <DropzoneInput
                fileName="taxes"
                requestId={this.props.creditRequest._id}
              /> :
                <Step1TaxesForm creditRequest={this.props.creditRequest} />
          }
        </div>
      </article>
    );
  }
}

Step1Part2.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
