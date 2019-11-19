import countries from 'i18n-iso-countries';

export const COMMON_COUNTRIES = ['CH', 'FR', 'DE', 'US'];

export const getSortedCountriesCodes = () => {
  const restCountries = Object.keys(countries.getNames('fr')).filter(
    code => !COMMON_COUNTRIES.includes(code),
  );
  return [
    ...COMMON_COUNTRIES,
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
