import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiTabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import cx from 'classnames';

import Link from '../Link';
import TabsContainer from './TabsContainer';

class Tabs extends Component {
  constructor(props) {
    super(props);
    // Make sure a tab index of -1 is not used
    this.state = { value: Math.max(this.props.initialIndex, 0) };
  }

  filterTabs = () =>
    this.props.tabs.filter(({ condition = true }) => condition);

  getContent = () => this.filterTabs()[this.state.value].content;

  handleChange = (event, value) => {
    const { onChangeCallback } = this.props;
    this.setState({ value });

    if (typeof onChange === 'function') {
      onChangeCallback();
    }
  };

  componentWillReceiveProps({ initialIndex: nextIndex }) {
    const { initialIndex } = this.props;

    if (nextIndex !== initialIndex) {
      this.setState({ value: nextIndex });
    }
  }

  render() {
    const {
      classes,
      tabs,
      initialIndex,
      className,
      onChangeCallback,
      ...otherProps
    } = this.props;
    const { value } = this.state;
    // initial index is destructured to avoid passing down an unrecognized prop
    // to MuiTabs

    return (
      <div className={cx('card1 card-top core-tabs', classes.root, className)}>
        <MuiTabs
          classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
          className="core-tabs-top"
          value={value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          {...otherProps}
        >
          {this.filterTabs().map(({ label, to, id }, i) => (
            <Tab
              classes={{
                root: classes.tabRoot,
                selected: classes.tabSelected,
                labelContainer: classes.labelContainer,
              }}
              label={label}
              component={to ? Link : undefined}
              to={to}
              key={id || i}
              className="core-tabs-tab"
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
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  initialIndex: PropTypes.number,
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Tabs.defaultProps = {
  className: '',
  initialIndex: 0,
};

export default TabsContainer(Tabs);
