import React, { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { DocHead } from 'meteor/kadira:dochead';

import RaisedButton from 'material-ui/RaisedButton';

import NewUserOptions from '/imports/ui/components/general/NewUserOptions.jsx';


export default class MainPage extends React.Component {
  componentWillMount() {
    // if a loanRequest exists, route to the current step
    if (this.props.loanRequest) {
      const realStep = this.props.loanRequest.logic.step + 1;
      FlowRouter.go(`/step${realStep}`);
    }

    DocHead.setTitle('Bienvenue! - e-Potek');
  }


  render() {
    if (!this.props.loanRequest) {
      return (
        <NewUserOptions />
      );
    }
    return (
      <div className="text-center">
        <h1>Oops il y a eu une erreur</h1>
        <RaisedButton
          label="Retour"
          href="/"
        />
      </div>
    );
  }
}

MainPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any),
};
