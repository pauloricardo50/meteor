export const getAgeFromBirthDate = birthDate =>
  Math.floor((new Date() - new Date(birthDate)) / 1000 / 60 / 60 / 24 / 365.25);
