export const getCookie = cookieName => {
  const cookie = RegExp(`${cookieName}[^;]+`).exec(document.cookie);
  return (
    cookie &&
    decodeURIComponent(cookie ? cookie.toString().replace(/^[^=]+./, '') : '')
  );
};

export const setCookie = (cookieName, value) => {
  document.cookie = `${cookieName}=${value}`;
};

export const parseCookies = () => {
  const cookies = document.cookie.split(';');
  return cookies.reduce((res, c) => {
    const [key, val] = c
      .trim()
      .split('=')
      .map(decodeURIComponent);
    try {
      return Object.assign(res, { [key]: JSON.parse(val) });
    } catch (e) {
      return Object.assign(res, { [key]: val });
    }
  }, {});
};
