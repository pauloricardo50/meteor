import PropTypes from 'prop-types';
import React, { Component } from 'react';
import merge from 'lodash/merge';

import T from 'core/components/Translation';
import track from 'core/utils/analytics';
import { toNumber } from 'core/utils/conversionFunctions';
import { loanUpdate } from 'core/api';
import Page from '../../components/Page';
import LoadingButton from '../../components/LoadingButton';
import StructureSliders from './StructureSliders';
import StructureRecap from './StructureRecap';
import StructureError from './StructureError';

const handleClick = (props, state) => {
  // Save data to DB
  const object = {};
  object['logic.hasValidatedStructure'] = true;
  object['general.fortuneUsed'] = state.fortuneUsed;
  object['general.insuranceFortuneUsed'] = state.insuranceFortuneUsed;

  loanUpdate
    .run({ object, loanId: props.loan._id })
    .then(() => track('validated structure', {}));
};

export default class StructurePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fortuneUsed: this.props.loan.general.fortuneUsed,
      insuranceFortuneUsed: this.props.loan.general.insuranceFortuneUsed,
      error: false,
    };
  }

  setParentState = (key, value) => this.setState({ [key]: value });

  handleChange = (value, id) =>
    this.setState({ [id]: Math.round(toNumber(value)) });

  render() {
    const { loan, borrowers, property } = this.props;
    const { fortuneUsed, insuranceFortuneUsed } = this.state;
    const modifiedLoan = merge({}, loan, {
      general: { fortuneUsed, insuranceFortuneUsed },
    });

    return (
      <Page id="structure">
        <section className="mask1 structure-page">
          <div className="description">
            <p>
              <T id="StructurePage.description" />
            </p>
          </div>

          <div className="text-center">
            <StructureError
              loan={modifiedLoan}
              borrowers={borrowers}
              property={property}
              setParentState={this.setParentState}
            />
          </div>

          <StructureSliders
            {...this.props}
            parentState={this.state}
            onChange={this.handleChange}
            disabled={loan.logic.hasValidatedStructure}
          />

          <StructureRecap {...this.props} loan={modifiedLoan} />

          <div
            className="text-center"
            style={{ marginTop: 60, marginBottom: 40 }}
          >
            <LoadingButton
              disabled={this.state.error}
              label={<T id="StructurePage.CTA" />}
              handleClick={() => handleClick(this.props, this.state)}
              value={!!loan.logic.hasValidatedStructure}
            />
          </div>
        </section>
      </Page>
    );
  }
}

StructurePage.propTypes = {
  loan: PropTypes.objectOf(PropTypes.any).isRequired,
  property: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
};
