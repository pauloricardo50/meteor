import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import RaisedButton from 'material-ui/RaisedButton';

import Step1InitialForm from '/imports/ui/components/steps/Step1InitialForm.jsx';
import Step1Financial from '/imports/ui/components/steps/Step1Financial.jsx';
import Step1TaxUpload from '/imports/ui/components/steps/Step1TaxUpload.jsx';
import Step1PropertyUpload from '/imports/ui/components/steps/Step1PropertyUpload.jsx';

import Step3FinancialForm from '/imports/ui/components/steps/Step3FinancialForm.jsx';
import Step3PersonalForm from '/imports/ui/components/steps/Step3PersonalForm.jsx';
import Step3PropertyForm from '/imports/ui/components/steps/Step3PropertyForm.jsx';


export default class TodoCardPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  renderCardContent() {
    switch (FlowRouter.getParam('cardId')) {
      case '1-1': return <Step1InitialForm creditRequest={this.props.creditRequest} />;
      case '1-2': return <Step1Financial creditRequest={this.props.creditRequest} />;
      case '1-3': return <Step1TaxUpload creditRequest={this.props.creditRequest} />;
      case '1-4': return <Step1PropertyUpload creditRequest={this.props.creditRequest} />;
      case '3-1': return <Step3PropertyForm creditRequest={this.props.creditRequest} />;
      case '3-2': return <Step3PersonalForm creditRequest={this.props.creditRequest} />;
      case '3-3': return <Step3FinancialForm creditRequest={this.props.creditRequest} />;
      default: return '';
    }
  }

  handleClick() {
    const stepNb = FlowRouter.getParam('cardId').charAt(0);
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
