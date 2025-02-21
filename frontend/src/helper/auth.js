export const setTokenCookie = (name, value, expiryDays) => {
  const date = new Date();
  date.setTime(date.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; secure; samesite=strict`;
};

export const getTokenFromCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const removeTokenCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
};

export const setUserToLocalStorage = (userData) => {
  const { accessToken, refreshToken, ...userInfo } = userData;
  setTokenCookie("accessToken", accessToken, 1);
  setTokenCookie("refreshToken", refreshToken, 7);
  localStorage.setItem("user", JSON.stringify(userInfo));
};

export const getUserFromLocalStorage = () => {
  const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    ...userInfo,
    accessToken: getTokenFromCookie("accessToken"),
    refreshToken: getTokenFromCookie("refreshToken"),
  };
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("user");
  removeTokenCookie("accessToken");
  removeTokenCookie("refreshToken");
};
