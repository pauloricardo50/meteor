import React from 'react';

import Button from '../components/Button';

export default buttonProps => Component =>
  class extends React.Component {
    constructor() {
      super();
      this.state = { hide: true };
    }

    render() {
      const { hide } = this.state;

      const props = typeof buttonProps === 'function' ? buttonProps(hide) : buttonProps;

      return (
        <>
          <Button {...props} onClick={() => this.setState({ hide: !hide })} />
          {!hide && <Component {...this.props} />}
        </>
      );
    }
  };
