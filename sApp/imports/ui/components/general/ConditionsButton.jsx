import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from '/imports/ui/components/general/Material/Dialog';
import Button from '/imports/ui/components/general/Button';

import { T } from 'core/components/Translation';
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

const getList = conditionArray => (
  <ul style={styles.list}>
    {conditionArray
      .map(c => (
        <li style={styles.listItem} key={c}>
          <h4 className="fixed-size">{c}</h4>
        </li>
      ))
      .reduce((prev, curr, i) => [
        prev,
        <hr style={styles.hr} key={i} />,
        curr,
      ])}
  </ul>
);

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
    const { primary, conditions, counterparts } = this.props;
    const actions = [
      <Button
        key={0}
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
          primary={primary}
          onClick={this.handleOpen}
          disabled={conditions.length === 0 && counterparts.length === 0}
        />
        <Dialog
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
        >
          <div className="conditions-modal">
            {!!(conditions.length > 0) && (
              <div>
                <h2 className="fixed-size">
                  <T id="ConditionsButton.mandatory" />
                </h2>
                {getList(conditions)}
              </div>
            )}

            {!!(counterparts.length > 0) && (
              <div>
                <h2 className="fixed-size">
                  <T id="ConditionsButton.counterparts" />
                </h2>
                {getList(counterparts)}
              </div>
            )}
          </div>
        </Dialog>
      </div>
    );
  }
}

ConditionsButton.propTypes = {
  conditions: PropTypes.arrayOf(PropTypes.string),
  counterparts: PropTypes.arrayOf(PropTypes.string),
};

ConditionsButton.defaultProps = {
  conditions: [],
  counterparts: [],
};
