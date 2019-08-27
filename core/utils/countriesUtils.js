import countries from 'i18n-iso-countries';

export const getSortedCountriesCodes = () => {
  const commonCountries = ['CH', 'FR', 'DE', 'US'];
  const restCountries = Object.keys(countries.getNames('fr')).filter(code => !commonCountries.includes(code));
  return [
    ...commonCountries,
    ...restCountries.sort((a, b) => {
      if (countries.getName(a, 'fr') > countries.getName(b, 'fr')) {
        return 1;
      }

      if (countries.getName(a, 'fr') < countries.getName(b, 'fr')) {
        return -1;
      }

      return 0;
    }),
  ];
};
