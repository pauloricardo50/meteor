import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import Dialog from './Material/Dialog';
import T from './Translation';

export default class ConditionsButton extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleOpen = e => {
    e.stopPropagation();
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { primary, conditions } = this.props;
    const { open } = this.state;
    const actions = [
      <Button
        key={0}
        label={<T id="ConditionsButton.CTA" />}
        primary
        onClick={this.handleClose}
      />,
    ];

    return (
      <>
        <Button
          raised
          label={<T id="ConditionsButton.title" />}
          primary={primary}
          onClick={this.handleOpen}
          disabled={conditions.length === 0}
        />
        <Dialog
          actions={actions}
          open={open}
          onClose={this.handleClose}
          // autoScrollBodyContent
        >
          <div className="conditions-modal">
            {!!(conditions.length > 0) && (
              <>
                <h2 className="fixed-size">
                  <T defaultMessage="Conditions obligatoires" />
                </h2>
                <ul>
                  {conditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Dialog>
      </>
    );
  }
}

ConditionsButton.propTypes = {
  conditions: PropTypes.string,
};

ConditionsButton.defaultProps = {
  conditions: '',
};
