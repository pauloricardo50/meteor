import { addEvent } from './eventsHelpers';

const EVENTS = {
  WITH_FUNC_EXAMPLE: 'WITH_FUNC_EXAMPLE',
  WITH_LIFECYCLE_EXAMPLE: 'WITH_LIFECYCLE_EXAMPLE',
};

addEvent(EVENTS.WITH_FUNC_EXAMPLE, {
  func: 'handleSubmit',
  config: (handleSubmitArgument1, handleSubmitArgument2) => ({
    eventName: 'Submitted something',
    metadata: { hello: 'world' },
  }),
});

addEvent(EVENTS.WITH_LIFECYCLE_EXAMPLE, {
  lifecycleMethod: 'componentDidMount',
  config: {
    eventName: 'Loaded this awesome component',
    metadata: { hello: 'world' },
  },
});

export default EVENTS;
