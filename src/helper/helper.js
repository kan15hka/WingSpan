export const toastType = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  NORMAL: "normal",
});

//////////////VALIDATION

export const isValidName = ({ name, setError }) => {
  if (name.length > 3) return true;
  else {
    setError("Name must be at least 4 characters long.");
    return false;
  }
};

export const isValidUsername = ({ username, setError }) => {
  const unRegex = /^(?=.*[a-z])(?=.*\d).{3,}$/;
  if (unRegex.test(username)) return true;
  else {
    setError(
      "Username must be at least 3 characters long and contain at least one lowercase letter and one digit."
    );
    return false;
  }
};

export const isValidPassword = ({ password, setError }) => {
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (pwdRegex.test(password)) return true;
  else {
    setError(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one digit."
    );
    return false;
  }
};
