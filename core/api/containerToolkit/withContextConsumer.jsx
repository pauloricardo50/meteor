import React from 'react';

const consumeContext = ({ consume, context, props }) => {
  if (consume && typeof consume === 'function') {
    return consume(props, context);
  }

  return context;
};

const withContextConsumer = ({ Context, consume }) => Component => props => (
  <Context.Consumer>
    {context => (
      <Component
        {...consumeContext({ consume, context, props })}
        {...props}
      />
    )}
  </Context.Consumer>
);

export default withContextConsumer;
