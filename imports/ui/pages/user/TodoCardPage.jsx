import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import RaisedButton from 'material-ui/RaisedButton';


import Step3FinancialForm from '/imports/ui/components/steps/Step3FinancialForm.jsx';
import Step3PersonalForm from '/imports/ui/components/steps/Step3PersonalForm.jsx';
import Step3PropertyForm from '/imports/ui/components/steps/Step3PropertyForm.jsx';
import Step3FileUpload from '/imports/ui/components/steps/Step3FileUpload.jsx';


export default class TodoCardPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  renderCardContent() {
    switch (FlowRouter.getParam('cardId')) {
      case 'property': return <Step3PropertyForm creditRequest={this.props.creditRequest} />;
      case 'perso': return <Step3PersonalForm creditRequest={this.props.creditRequest} />;
      case 'finance': return <Step3FinancialForm creditRequest={this.props.creditRequest} />;
      case 'files': return <Step3FileUpload creditRequest={this.props.creditRequest} />;
      default: return '';
    }
  }

  handleClick() {
    const stepNb = FlowRouter.current().path.charAt(5);
    if (stepNb === '1') {
      FlowRouter.go('/step1');
    } else if (stepNb === '3') {
      FlowRouter.go('/step3');
    } else if (stepNb === '5') {
      FlowRouter.go('/step5');
    }
  }

  render() {
    // If the view sessions variable is empty, go back
    return (
      <section className="animated fadeIn">
        <div className="form-group">
          {/* <a
            href={'/step1'}
            className="btn btn-default animated slideInLeft"
            id="back"
          >
            <span className="fa fa-angle-left" /> Retour
          </a> */}
          <RaisedButton
            icon={<span className="fa fa-angle-left" />}
            label="Retour"
            onClick={this.handleClick}
            className="animated slideInLeft"
          />
        </div>
        {this.renderCardContent()}
      </section>
    );
  }
}

TodoCardPage.propTypes = {
  creditRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
