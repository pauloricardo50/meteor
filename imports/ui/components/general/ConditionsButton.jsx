import React from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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
      .map(c => <li style={styles.listItem}><h4 className="fixed-size">{c}</h4></li>)
      .reduce((prev, curr) => [prev, <hr style={styles.hr} />, curr])}
  </ul>
);

export default class ConditionsButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleOpen = e => {
    e.stopPropagation();
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const actions = [<FlatButton label="Ok" primary onTouchTap={this.handleClose} />];

    return (
      <div>
        <RaisedButton label="Conditions" onTouchTap={this.handleOpen} {...this.props} />
        <Dialog
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent
        >
          <div className="conditions-modal">
            {this.props.conditions.length > 0 &&
              <div>
                <h2 className="fixed-size">Conditions <small>Obligatoires</small></h2>
                {getList(this.props.conditions)}
              </div>}

            {this.props.counterparts.length > 0 &&
              <div>
                <h2 className="fixed-size">
                  Contreparties
                  {' '}
                  <small>Pour les meilleurs taux</small>
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
