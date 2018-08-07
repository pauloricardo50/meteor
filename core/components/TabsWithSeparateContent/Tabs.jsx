import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import MuiTabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    paddingTop: 0,
  },
});

class Tabs extends Component {
  constructor(props) {
    super(props);
    // Make sure a tab index of -1 is not used
    this.state = { value: Math.max(this.props.initialIndex, 0) };
  }

  getContent = () => this.props.tabs[this.state.value].content;

  handleChange = (event, value) => this.setState({ value });

  render() {
    const { classes, tabs } = this.props;

    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <MuiTabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            {tabs.map((tab, i) => (
              <Tab label={tab.label} key={i} />
            ))}
          </MuiTabs>
        </Paper>
        <div className="mask1" style={{ paddingTop: 16, marginTop: 40 }}>
          {this.getContent()}
        </div>
      </React.Fragment>
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
