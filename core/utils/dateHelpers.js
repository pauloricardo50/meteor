export const addTimezoneOffset = date =>
  new Date(date.getTime() + date.getTimezoneOffset() * 60000);

export const subtractTimezoneOffset = date =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);
