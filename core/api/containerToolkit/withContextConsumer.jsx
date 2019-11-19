import React from 'react';

const consumeContext = ({ consume, context, props, contextName }) => {
  if (consume && typeof consume === 'function') {
    return consume(props, context);
  }
  if (contextName) {
    return { [contextName]: context };
  }

  return context;
};

const withContextConsumer = ({
  Context,
  consume,
  contextName,
}) => Component => props => (
  <Context.Consumer>
    {context => (
      <Component
        {...consumeContext({ consume, context, props, contextName })}
        {...props}
      />
    )}
  </Context.Consumer>
);

export default withContextConsumer;
