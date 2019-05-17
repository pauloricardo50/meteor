export const getCookie = (cookieName) => {
  const cookie = RegExp(`${cookieName}[^;]+`).exec(document.cookie);
  return decodeURIComponent(cookie ? cookie.toString().replace(/^[^=]+./, '') : '');
};

export const setCookie = (cookieName, value) => {
  document.cookie = `${cookieName}=${value}`;
};
