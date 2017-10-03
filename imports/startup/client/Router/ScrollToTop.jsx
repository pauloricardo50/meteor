import { Component } from 'react';
import PropTypes from 'prop-types';

export default class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

ScrollToTop.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  children: PropTypes.node.isRequired,
};
