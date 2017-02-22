import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import RaisedButton from 'material-ui/RaisedButton';


import Step3FinancialForm from '/imports/ui/components/steps/Step3FinancialForm.jsx';
import Step3PersonalForm from '/imports/ui/components/steps/Step3PersonalForm.jsx';
import Step3PropertyForm from '/imports/ui/components/steps/Step3PropertyForm.jsx';
import Step3FileUpload from '/imports/ui/components/steps/Step3FileUpload.jsx';

const styles = {
  okButton: {
    marginTop: 15,
  },
};

export default class TodoCardPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
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


  renderCardContent() {
    switch (FlowRouter.getParam('cardId')) {
      case 'personal': return <Step3PersonalForm loanRequest={this.props.loanRequest} />;
      case 'property': return <Step3PropertyForm loanRequest={this.props.loanRequest} />;
      case 'finance': return <Step3FinancialForm loanRequest={this.props.loanRequest} />;
      case 'files': return <Step3FileUpload loanRequest={this.props.loanRequest} />;
      default: return '';
    }
  }


  render() {
    return (
      <section className="animated fadeIn">
        <div className="form-group">
          <RaisedButton
            icon={<span className="fa fa-angle-left" />}
            label="Retour"
            onTouchTap={this.handleClick}
            className="animated slideInLeft"
          />
          <span className="pull-right" style={styles.okSpan}>
            <RaisedButton
              label="Ok"
              onTouchTap={this.handleClick}
              primary
            />
          </span>
        </div>
        {this.renderCardContent()}
        <div className="form-group pull-right" style={styles.okButton}>
          <RaisedButton
            label="Ok"
            onTouchTap={this.handleClick}
            primary
          />
        </div>
      </section>
    );
  }
}

TodoCardPage.propTypes = {
  loanRequest: React.PropTypes.objectOf(React.PropTypes.any),
};
