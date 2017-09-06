import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import Button from '/imports/ui/components/general/Button.jsx';

import { T } from '/imports/ui/components/general/Translation.jsx';
import track from '/imports/js/helpers/analytics';

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

const getList = conditionArray =>
  (<ul style={styles.list}>
    {conditionArray
      .map(c =>
        (<li style={styles.listItem}>
          <h4 className="fixed-size">
            {c}
          </h4>
        </li>),
      )
      .reduce((prev, curr) => [prev, <hr style={styles.hr} />, curr])}
  </ul>);

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
    const actions = [
      <Button
        label={<T id="ConditionsButton.CTA" />}
        primary
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        <Button
          raised
          label={<T id="ConditionsButton.title" />}
          onClick={this.handleOpen}
          primary={this.props.primary}
          onClick={this.props.onClick}
        />
        <Dialog
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
        >
          <div className="conditions-modal">
            {this.props.conditions.length > 0 &&
              <div>
                <h2 className="fixed-size">
                  <T id="ConditionsButton.mandatory" />
                </h2>
                {getList(this.props.conditions)}
              </div>}

            {this.props.counterparts.length > 0 &&
              <div>
                <h2 className="fixed-size">
                  <T id="ConditionsButton.counterparts" />
                </h2>
                {getList(this.props.counterparts)}
              </div>}
          </div>
        </Dialog>
      </div>
    );
  }
}

ConditionsButton.propTypes = {
  conditions: PropTypes.arrayOf(PropTypes.string).isRequired,
  counterparts: PropTypes.arrayOf(PropTypes.string).isRequired,
};
