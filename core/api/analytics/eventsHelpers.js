// const EVENT_CONFIG = {};

// // this is useful in tests
// export const addEvent = (eventName, options) => {
//   EVENT_CONFIG[eventName] = options;
// };

// export const getEvent = (event) => {
//   // If getting an event by string, return config stored in EVENT_CONFIG
//   if (typeof event === 'string') {
//     return EVENT_CONFIG[event] || {};
//   }

//   // Else, simply use an immediately created event config
//   return event;
// };

// export const getEventConfig = (eventName, params) => {
//   const { config } = getEvent(eventName);
//   return typeof config === 'function' ? config(params) : config;
// };
