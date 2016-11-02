import React, {PropTypes} from 'react';

import RaisedButton from 'material-ui/RaisedButton';


export default class Step2Page extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="mask1">
        <h1>Appel d'offres anonyme</h1>
        <div>Icons</div>
        <p
          className="col-sm-6 col-sm-offset-3"
          style={{ textAlign: 'justify', padding: 20 }}
        >
          Lorsque vous estimez que vos informations sont correctes
          et que vous ne voulez plus les modifier, appuyez sur envoyer.
        </p>
        <div className="col-xs-12">
          <div className="form-group text-center">
            <RaisedButton label="Envoyer" primary />
          </div>
          <div className="form-group text-center">
            <RaisedButton label="Non, je veux modifier mes données" />
          </div>
        </div>
      </section>
    );
  }
}

Step2Page.propTypes = {
};
