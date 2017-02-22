// Rounds the value, adds thousands markers every 3 digits (and removes non-digit characters)
export function toMoney(value) {
  if (value === 0) {
    return 0;
  }
  return String(Math.round(Number(Math.round(value)))).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}


// Replaces any nondigit character by an empty character, to prevent the use of non-digits
// Only do this if the value actually exists
export function toNumber(value) {
  if (value === 0) {
    return 0;
  }
  return value ? Number(String(value).replace(/\D/g, '')) : value;
}

// Replaces any nondigit character by an empty character, to prevent the use of non-digits
// Only do this if the value actually exists
export function toDecimalNumber(value) {
  // Remove unwanted characters, except digits, dots and commas
  const newValue = value ? String(value).replace(/[^\d.,]/g, '') : value;
  // replace commas with dots
  return value ? Number(newValue.replace(',', '.')) : value;
}
