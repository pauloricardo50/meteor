import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { Meteor } from 'meteor/meteor';

import RaisedButton from 'material-ui/RaisedButton';
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
  button: {
    float: 'right',
  },
};

export default class Step1Page extends Component {
  constructor(props) {
    super(props);

    this.handleCheck = this.handleCheck.bind(this);
    this.isReady = this.isReady.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
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

  isReady() {
    let projectReady = false;
    let taxesReady = false;
    // For readability
    const r = this.props.creditRequest;

    if (r.files.willUploadTaxes) {
      if (r.files.taxes) {
        if (r.files.taxes.url) {
          taxesReady = true;
        }
      }
    } else {

    }

    return projectReady && taxesReady;
  }

  render() {
    return (
      <section>
        <h1 className="stepTitle">
          1ère Étape
          <small> Encore quelques informations avant qu'on se mette au travail</small>
        </h1>

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

        <RaisedButton
          label="Continuer"
          disabled={!this.isReady()}
          primary
          style={styles.button}
          href="/step2"
        />

      </section>
    );
  }
}


Step1Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
