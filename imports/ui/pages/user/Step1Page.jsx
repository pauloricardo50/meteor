import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import DropzoneInput from '/imports/ui/components/forms/DropzoneInput.jsx';


const styles = {
  mask: {
    marginBottom: 40,
  },
  p: {
    padding: 20,
  },
  checkbox: {
    marginBottom: 20,
  },
  button: {
    float: 'right',
  },
};

export default class Step1Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      willUploadTaxes: true,
    };

    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
  }

  handleCheck(event, isInputChecked) {
    this.setState({ willUploadTaxes: !isInputChecked });
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
          <DropzoneInput
            fileName="housePicture"
            requestId={this.props.creditRequest._id}
          />
        </article>

        <article className="mask2" style={styles.mask}>
          <h3>Votre déclaration d'impôts</h3>
          <p style={styles.p}>
            Pour permettre au établissements financiers de vous faire une offre très précise,
            nous pouvons leur faire savoir que vous nous avez déjà confié votre
            déclaration d'impôts, sans la leur montrer.
            <br />
            Certains établissements refuseront de faire une offre, car ils considèreront que votre
            dossier n'est pas assez sérieux.
          </p>

          <div className="col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-3 secondary">
            <Checkbox
              label="J'uploaderai ma déclaration d'impôts plus tard"
              style={styles.checkbox}
              onCheck={this.handleCheck}
            />
          </div>

          <div className="col-xs-12">
            {this.state.willUploadTaxes &&
              <DropzoneInput
                fileName="taxes"
                requestId={this.props.creditRequest._id}
              />
            }
          </div>
        </article>

        <RaisedButton
          label="Continuer"
          disabled={!this.state.isReady}
          primary
          style={styles.button}
        />

      </section>
    );
  }
}


Step1Page.propTypes = {
  creditRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
