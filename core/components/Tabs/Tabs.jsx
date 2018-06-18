import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MuiTabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import cx from 'classnames';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
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
    const {
      classes,
      tabs,
      initialIndex,
      className,
      ...otherProps
    } = this.props;
    // initial index is destructured to avoid passing down an unrecognized prop
    // to MuiTabs

    return (
      <div className={cx('mask1 core-tabs', classes.root, className)}>
        <MuiTabs
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          className="core-tabs-top"
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          {...otherProps}
        >
          {tabs.map(({ label, to }, i) => (
            <Tab
              classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              label={label}
              component={to ? Link : undefined}
              to={to}
              key={i}
            />
          ))}
        </MuiTabs>
        <div className="tab-content">{this.getContent()}</div>
      </div>
    );
  }
}

Tabs.propTypes = {
  // Array of objects with 'label' and 'content'
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  initialIndex: PropTypes.number,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

Tabs.defaultProps = {
  initialIndex: 0,
  className: '',
};

export default withStyles(styles)(Tabs);
