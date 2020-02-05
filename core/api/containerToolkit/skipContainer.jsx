//
import React, { Component } from 'react';

// Determine whether to skip adding an HOC `container` based on a `skip`
// function, only change the wrappedComponent when needed to avoid UI flashes
const makeSkipContainer = (container, skip) => WrappedComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this.setWrappedComponent(props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (skip(this.props) !== skip(nextProps)) {
        this.setWrappedComponent(nextProps);
        this.forceUpdate();
      }
    }

    setWrappedComponent(props) {
      this.wrappedComponent = skip(props)
        ? WrappedComponent
        : container(WrappedComponent);
    }

    render() {
      const FinalComponent = this.wrappedComponent;
      return <FinalComponent {...this.props} />;
    }
  };

export default makeSkipContainer;
