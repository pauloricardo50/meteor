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
      return (
        <>
          <Button
            {...buttonProps}
            onClick={() => this.setState({ hide: !hide })}
          />
          {!hide && <Component {...this.props} />}
        </>
      );
    }
  };
