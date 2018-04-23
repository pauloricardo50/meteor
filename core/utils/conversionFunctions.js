// Rounds the value, adds thousands markers every 3 digits (and removes non-digit characters)
export function toMoney(value) {
  if (value === 0) {
    return 0;
  } else if (!value) {
    // Don't format the value if it is undefined or an empty string
    return value;
  }
  return String(Math.round(Number(Math.round(value))))
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Replaces any nondigit character by an empty character, to prevent the use of non-digits
// Only do this if the value actually exists
export function toNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  return value ? Number(String(value).replace(/\D/g, '')) : value;
}

// Replaces any nondigit character by an empty character, to prevent the use of non-digits
// Only do this if the value actually exists
export function toDecimalNumber(value) {
  if (typeof value === 'number') {
    return value;
  }
  // Remove unwanted characters, except digits, dots and commas
  const newValue = value ? String(value).replace(/[^\d.,]/g, '') : value;
  // replace commas with dots
  const commaReplaced = newValue
    ? Number(newValue.replace(',', '.'))
    : newValue;
  return commaReplaced;
}

export const toDistanceString = (dist) => {
  if (dist <= 0) {
    return '0 m';
  } else if (dist < 1000) {
    return `${Math.round(dist / 10) * 10} m`;
  } else if (dist < 10000) {
    return `${(Math.round(dist / 100) / 10).toFixed(1)} km`;
  }

  return `${Math.round(dist / 1000)} km`;
};
