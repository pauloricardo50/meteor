import React from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import InitialForm from '/imports/ui/components/requestSteps/InitialForm.jsx';
import FinancialPartners from '/imports/ui/components/requestSteps/FinancialPartners.jsx';
import TaxUpload from '/imports/ui/components/requestSteps/TaxUpload.jsx';
import PropertyUpload from '/imports/ui/components/requestSteps/PropertyUpload.jsx';
import OffersTable from '/imports/ui/components/requestSteps/OffersTable.jsx';


export default class DoPage extends React.Component {

  renderCardContent() {
    switch (FlowRouter.getParam('cardId')) {
      case '0': return <InitialForm creditRequest={this.props.creditRequest} />;
      case '1': return <FinancialPartners creditRequest={this.props.creditRequest} />;
      case '2': return <TaxUpload creditRequest={this.props.creditRequest} />;
      case '3': return <PropertyUpload creditRequest={this.props.creditRequest} />;
      case '4': return <OffersTable creditRequest={this.props.creditRequest} />;
      default: return '';
    }
  }

  render() {
    // If the view sessions variable is empty, go back
    return (
      <section>
        <div className="form-group">
          <a
            href={`/${FlowRouter.getParam('id')}/todo`}
            className="btn btn-default animated slideInLeft"
            id="back"
          >
            <span className="fa fa-angle-left" /> Retour
          </a>
        </div>
        {this.renderCardContent()}
      </section>
    );
  }
}

DoPage.propTypes = {
  creditRequest: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
};
