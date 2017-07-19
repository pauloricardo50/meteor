import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button.jsx';

import { T } from '/imports/ui/components/general/Translation.jsx';

export default class CompareColumnFooter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
    };
  }

  toggleButtons = () =>
    this.setState(prev => ({ showButtons: !prev.showButtons }));

  render() {
    const { showButtons } = this.state;
    return (
      <div className="flex-col center">
        <Button
          label={
            <T
              id={
                showButtons
                  ? 'CompareColumnFooter.hide'
                  : 'CompareColumnFooter.show'
              }
            />
          }
          onTouchTap={this.toggleButtons}
          style={{ margin: '8px 0' }}
        />

        {showButtons &&
          <div className="flex-col center">
            <Button
              raised
              label={<T id="general.modify" />}
              style={{ margin: '8px 0' }}
              primary
            />
            <Button
              raised
              label={<T id="general.delete" />}
              style={{ margin: '8px 0' }}
            />
          </div>}
      </div>
    );
  }
}

CompareColumnFooter.propTypes = {};
