import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation.jsx';
import Button from '/imports/ui/components/general/Button.jsx';

const TrancheCount = ({ trancheCount, handleAdd }) =>
  (<div className="tranche-count">
    <T id="TrancheCount.description" />
    <h4 style={{ paddingLeft: 8, paddingRight: 32 }}>
      {trancheCount}
    </h4>
    <Button
      raised
      primary
      onClick={handleAdd}
      label={<T id="TrancheCount.add" />}
    />
  </div>);

const BottomButtons = ({ handleSave, handleCancel }) =>
  (<div className="buttons">
    <Button
      label={<T id="general.cancel" />}
      onClick={handleCancel}
      style={{ marginRight: 8 }}
    />
    <Button primary label={<T id="general.save" />} onClick={handleSave} />
  </div>);

export default class TranchePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { tranches: [] };
  }

  handleAddTranche = () =>
    this.setState({ tranches: [...this.state.tranches, {}] });

  handleSave = () => {};
  handleCancel = () => {};

  render() {
    const { tranches } = this.state;
    return (
      <div className="tranche-picker">
        <div className="picker-content">
          <div className="selector">
            <TrancheCount
              trancheCount={tranches.length}
              handleAdd={this.handleAddTranche}
            />
          </div>
          <div
            className="chart"
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'deepskyblue',
            }}
          />
        </div>
        <BottomButtons
          handleSave={this.handleSave}
          handleCancel={this.handleCancel}
        />
      </div>
    );
  }
}

TranchePicker.propTypes = {};
