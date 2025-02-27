export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const formatTimeTo12Hour = (timeString) => {
  if (!timeString) return "N/A"; // Handle null or undefined values

  try {
    const [hours, minutes] = timeString.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) return "Invalid Time"; // Handle cases where split fails

    let hour = hours % 12 || 12; // Convert 0 to 12 for AM
    const amPm = hours >= 12 ? "PM" : "AM";

    return `${hour}:${minutes.toString().padStart(2, "0")} ${amPm}`;
  } catch (error) {
    return "Invalid Time";
  }
};

export function convertTime(seconds) {
  if (seconds < 60) {
    return `${seconds.toFixed(2)} seconds`;
  } else if (seconds >= 60 && seconds < 3600) {
    let minutes = (seconds / 60).toFixed(2);
    return `${minutes} minutes`;
  } else if (seconds >= 3600 && seconds < 86400) {
    let hours = (seconds / 3600).toFixed(2);
    return `${hours} hours`;
  } else {
    let days = (seconds / 86400).toFixed(2);
    return `${days} days`;
  }
}
