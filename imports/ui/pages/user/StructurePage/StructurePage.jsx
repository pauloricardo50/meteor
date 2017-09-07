import PropTypes from 'prop-types';
import React, { Component } from 'react';
import merge from 'lodash/merge';

import cleanMethod from '/imports/api/cleanMethods';

import LoadingButton from '/imports/ui/components/general/LoadingButton.jsx';
import ProcessPage from '/imports/ui/components/general/ProcessPage.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';
import track from '/imports/js/helpers/analytics';
import { toNumber } from '/imports/js/helpers/conversionFunctions';

import StructureSliders from './structurePage/StructureSliders.jsx';
import StructureRecap from './structurePage/StructureRecap.jsx';
import StructureError from './structurePage/StructureError.jsx';

const handleClick = (props, state) => {
  // Save data to DB
  const object = {};
  object['logic.hasValidatedStructure'] = true;
  object['general.fortuneUsed'] = state.fortuneUsed;
  object['general.insuranceFortuneUsed'] = state.insuranceFortuneUsed;

  cleanMethod('updateRequest', object, props.loanRequest._id).then(() =>
    track('validated structure', {}),
  );
};

export default class StructurePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fortuneUsed: this.props.loanRequest.general.fortuneUsed,
      insuranceFortuneUsed: this.props.loanRequest.general.insuranceFortuneUsed,
      error: false,
    };
  }

  handleChange = (value, id) => {
    const object = {};
    object[id] = Math.round(toNumber(value));
    this.setState(object);
  };

  setParentState = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { loanRequest, borrowers } = this.props;
    const modifiedRequest = merge({}, loanRequest, {
      general: {
        fortuneUsed: this.state.fortuneUsed,
        insuranceFortuneUsed: this.state.insuranceFortuneUsed,
      },
    });

    return (
      <ProcessPage {...this.props} stepNb={2} id="structure" showBottom={false}>
        <section className="mask1">
          <div className="description">
            <p>
              <T id="StructurePage.description" />
            </p>
          </div>

          <div className="text-center">
            <StructureError
              loanRequest={modifiedRequest}
              borrowers={borrowers}
              setParentState={this.setParentState}
            />
          </div>

          <StructureSliders
            {...this.props}
            parentState={this.state}
            handleChange={this.handleChange}
            disabled={loanRequest.logic.hasValidatedStructure}
          />

          <StructureRecap {...this.props} loanRequest={modifiedRequest} />

          <div
            className="text-center"
            style={{ marginTop: 60, marginBottom: 40 }}
          >
            <LoadingButton
              disabled={this.state.error}
              label={<T id="StructurePage.CTA" />}
              handleClick={() => handleClick(this.props, this.state)}
              value={!!loanRequest.logic.hasValidatedStructure}
            />
          </div>
        </section>
      </ProcessPage>
    );
  }
}

StructurePage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
