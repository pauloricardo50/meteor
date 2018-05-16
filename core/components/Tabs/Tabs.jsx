import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import MuiTabs, { Tab } from 'material-ui/Tabs';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing.unit * 3,
  },
});

class Tabs extends Component {
  constructor(props) {
    super(props);
    // Make sure a tab index of -1 is not used
    this.state = { value: Math.max(this.props.initialIndex, 0) };
    console.log('>>>', props, this.state);
  }

  getContent = () => this.props.tabs[this.state.value].content;

  handleChange = (event, value) => this.setState({ value });

  render() {
    const { classes, tabs, initialIndex, ...otherProps } = this.props;
    // initial index is destructured to avoid passing down an unrecognized prop
    // to MuiTabs

    return (
      <div>
        <Paper className={classes.root}>
          <MuiTabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered={!otherProps.scrollable}
            {...otherProps}
          >
            {tabs.map(({ label, to }, i) => (
              <Tab
                label={label}
                component={to ? Link : undefined}
                to={to}
                key={i}
              />
            ))}
          </MuiTabs>
        </Paper>
        <div style={{ paddingTop: 16 }}>{this.getContent()}</div>
      </div>
    );
  }
}

Tabs.propTypes = {
  // Array of objects with 'label' and 'content'
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialIndex: PropTypes.number,
};

Tabs.defaultProps = {
  initialIndex: 0,
};

export default withStyles(styles)(Tabs);
