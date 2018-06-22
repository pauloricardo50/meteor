// Validators
export const required = value => (value ? undefined : 'Ce champ est requis');

export const number = value =>
  (value && Number.isNaN(Number(value)) ? 'Il nous faut un nombre' : undefined);

// For empty strings if will return undefined, careful to use required as well
export const email = value =>
  (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Il nous faut un email'
    : undefined);
