import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';

import Step1Part1 from '/imports/ui/components/steps/Step1Part1.jsx';
import Step1Part2 from '/imports/ui/components/steps/Step1Part2.jsx';


const styles = {
  button: {
    float: 'right',
  },
};

export default class Step1Page extends Component {
  constructor(props) {
    super(props);

    this.isReady = this.isReady.bind(this);
  }

  componentDidMount() {
    DocHead.setTitle('Étape 1 - e-Potek');
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

        <Step1Part1 creditRequest={this.props.creditRequest} />
        <Step1Part2 creditRequest={this.props.creditRequest} />

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
