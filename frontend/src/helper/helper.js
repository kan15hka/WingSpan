export const toastType = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  NORMAL: "normal",
});

export const flightType = Object.freeze({
  FROM: "from",
  TO: "to",
});

export const modalType = Object.freeze({
  ADD: "add",
  EDIT: "edit",
});

export const flightViewModalType = Object.freeze({
  AIRPLANE: "airplane",
  CREW: "crew",
  BOOKING: "booking",
});

export const crewType = Object.freeze({
  PILOT: "pilot",
  COPILOT: "co-pilot",
  FLIGHTATTENDANT: "flight-attendant",
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

//////////////FILE MANIPULATION
export const base64ToFile = (base64String, filename) => {
  try {
    // Remove any data URI scheme prefix (e.g., "data:image/jpeg;base64,")
    //const cleanBase64 = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Convert Base64 to binary data
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: "image/jpeg" });
  } catch (error) {
    console.error("Invalid Base64 string:", error);
    return null; // Return null to prevent crashes
  }
};

//////////DATE CONVERSIONS
export const formatDateToddMonthYYYY = (date) => {
  const parsedDate = new Date(date); // Ensure it's a Date object
  if (isNaN(parsedDate)) {
    throw new Error("Invalid date");
  }
  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

//Convert date to dd-mm-yyyy ie 12-08-2003
export const formatDate = (date) => {
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}`;
};
