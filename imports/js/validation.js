import is from 'is_js';

const names = [
  'Bill Gates',
  'Steve Jobs',
  'Warren Buffet',
  'Mark Zuckerberg',
  'Ingvar',
  'Jeff Bezos',
  'Michael Bloomberg',
  'Larry Page',
  'Sergey Brin',
  'Cristiano Ronaldo',
  'Roger Federer',
  'Lionel Messi',
  'Madonna',
  'Beyonce',
  'Tom Cruise',
];

export const moneyValidation = value => {
  let errors = [];
  const numValue = Number(value);

  // Allow values upto 100 million
  if (numValue === 0) {
    // Replace this by is.empty() if I end up using numeric state values
    errors.push('Entrez une valeur!');
  } else if (is.nan(numValue)) {
    errors.push('Houston, nous avons un problème!');
  } else if (is.under(numValue, 0)) {
    errors.push("C'est la faillite!");
  } else if (is.above(numValue, 100000000)) {
    const name = names[Math.floor(Math.random() * names.length)];
    errors.push(`Rentre chez toi ${name}!`);
  }

  return errors;
};

export const emailValidation = value => {
  let isValid = true;
  let errors = [];

  if (is.not.email(value)) {
    isValid = false;
    errors.push("Cette adresse email n'est pas valide");
  }

  return [isValid, errors];
};

export const ageValidation = value => {
  const errors = [];
  const numValue = Number(value);

  // Allow ages between 18 and 99
  if (numValue === 0) {
    // Replace this by is.empty() if I end up using numeric state values
    errors.push('Entrez un age!');
  } else if (is.nan(numValue)) {
    errors.push("Ce n'est pas un age ça?");
  } else if (is.under(numValue, 18)) {
    errors.push('On ne peut pas aider les enfants!');
  } else if (is.above(numValue, 99)) {
    errors.push('Sneaky Hacker!');
  }

  return errors;
};
