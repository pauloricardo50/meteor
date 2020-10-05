// In development, this stores any messages
// created with defaultMessage so it can be
// merged with messages from the TMS.
// This allows us to reference them by id and show
// their defaultMessage without extracting first

export const messages = {};
const listeners = [];

export function onMessageAdded(listener) {
  listeners.push(listener);

  return function remove() {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

export default function defineMessage({ id, defaultMessage }) {
  if (process.env.NODE_ENV !== 'production') {
    messages[id] = defaultMessage;
  }

  // TODO: debounce
  listeners.forEach(listener => listener());

  // eslint-disable-next-line prefer-rest-params
  return arguments[0];
}
