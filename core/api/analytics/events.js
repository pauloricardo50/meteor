const EVENTS = {
  CLICKED_LOGIN_BUTTON: 'CLICKED_LOGIN_BUTTON',
  SUBMITTED_SURVEY_FORM: 'SUBMITTED_SURVEY_FORM',
};

const EVENT_OPTIONS = {};

// this is useful in tests
export const addEvent = (eventName, options) => {
  EVENTS[eventName] = eventName;
  EVENT_OPTIONS[eventName] = options;
};

export const getEvent = eventName => EVENT_OPTIONS[eventName] || {};

export const getEventConfig = (eventName, params) => {
  const { config } = getEvent(eventName);
  return typeof config === 'function' ? config(params) : config;
};

export default EVENTS;
