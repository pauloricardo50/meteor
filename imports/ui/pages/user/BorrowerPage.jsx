import React, { PropTypes } from 'react';

import { BorrowerSchema } from '/imports/api/borrowers/borrowers';
import SimpleSchema2Bridge from 'uniforms/SimpleSchema2Bridge';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import AutoForm from 'uniforms-material/AutoForm';

export default class BorrowerPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const bridge = new SimpleSchema2Bridge(BorrowerSchema);

    return (
      <div>
        <RaisedButton
          label="Retour"
          containerElement={<Link to="/app/me" />}
          style={{ marginBottom: 20 }}
        />
        <section className="mask1">
          <h1>{this.props.borrower.firstName || 'Informations personelles'}</h1>

          <article className="borrower-form">
            <AutoForm
              schema={bridge}
              model={this.props.borrower}
              autosave
              autosaveDelay={500}
              submitField={() => null}
              onSubmit={() => console.log('submitting')}
              // onSubmitSuccess={() => alert('Promise resolved!')}
              // onSubmitFailure={() => alert('Promise rejected!')}
            />
          </article>
        </section>
      </div>
    );
  }
}

BorrowerPage.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};
