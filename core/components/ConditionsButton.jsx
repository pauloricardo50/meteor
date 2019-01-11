import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';

import T from 'core/components/Translation';
import track from 'core/utils/analytics';

const styles = {
  hr: {
    width: '50%',
    margin: '60px auto',
  },
  list: {
    listStyle: 'none',
    textAlign: 'center',
  },
  listItem: {
    padding: '10px 0',
  },
};

export default class ConditionsButton extends Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  handleOpen = (e) => {
    e.stopPropagation();
    track('ConditionsButton - clicked open', {});
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
      <React.Fragment>
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
              <React.Fragment>
                <h2 className="fixed-size">
                  <T id="ConditionsButton.mandatory" />
                </h2>
                <ul>
                  {conditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </React.Fragment>
            )}
          </div>
        </Dialog>
      </React.Fragment>
    );
  }
}

ConditionsButton.propTypes = {
  conditions: PropTypes.string,
};

ConditionsButton.defaultProps = {
  conditions: '',
};
