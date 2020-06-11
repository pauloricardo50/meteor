import countries from 'i18n-iso-countries';

export const COMMON_COUNTRIES = ['CH', 'FR', 'DE', 'US'];

export const getSortedCountriesCodes = () => {
  const restCountries = Object.keys(countries.getNames('fr')).filter(
    code => !COMMON_COUNTRIES.includes(code),
  );
  return [
    ...COMMON_COUNTRIES,
    ...restCountries.sort((a, b) =>
      countries
        .getName(a, 'fr')
        .localeCompare(countries.getName(b, 'fr'), 'fr', {
          ignorePunctuation: true,
        }),
    ),
  ];
};
