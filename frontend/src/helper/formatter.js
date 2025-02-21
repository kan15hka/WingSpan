export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export const formatDateLikeddMonth = (date) => {
  const parsedDate = new Date(date); // Ensure it's a Date object
  if (isNaN(parsedDate)) {
    throw new Error("Invalid date");
  }

  // Format the date to "14 Feb"
  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short", // Abbreviated month name
  });
};

export function formatFlightsByDate(flights) {
  return flights.reduce((acc, flight) => {
    const formattedDate = formatDate(flight.date);
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(flight);
    return acc;
  }, {});
}

export const convertToHHMM = (timeStr) => {
  const [hours, minutes] = timeStr.split(":");
  return `${hours}:${minutes}`;
};
// export const convertToHHMM=(timeString)=> {
//   if (!timeString || typeof timeString !== "string") {
//     console.error("Invalid timeString passed to convertToHHMM:", timeString);
//     return "Invalid Time"; // Or return a default value
//   }

//   const [hours, minutes] = timeString.split(":");
//   return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
// }

export const calculateTimeGap = (timeStr1, timeStr2) => {
  const [hours1, minutes1] = timeStr1.split(":").map(Number);
  const [hours2, minutes2] = timeStr2.split(":").map(Number);

  // Convert to minutes since midnight
  const time1InMinutes = hours1 * 60 + minutes1;
  const time2InMinutes = hours2 * 60 + minutes2;

  // Calculate the difference in minutes
  const gapInMinutes = Math.abs(time2InMinutes - time1InMinutes);

  // Convert the gap to hours and minutes
  const gapHours = Math.floor(gapInMinutes / 60);
  const gapMinutes = gapInMinutes % 60;

  // Return in "Xhr Ym" format
  const formattedGap = `${gapHours}hr ${gapMinutes}m`;

  return formattedGap;
};

//Seperate crew by role
export function categorizeCrewByRole(crewData) {
  const pilotList = [];
  const coPilotList = [];
  const flightAttendantList = [];

  crewData.forEach((crewMember) => {
    if (crewMember.role === "pilot") {
      pilotList.push(crewMember);
    } else if (crewMember.role === "co-pilot") {
      coPilotList.push(crewMember);
    } else if (crewMember.role === "flight-attendant") {
      flightAttendantList.push(crewMember);
    }
  });

  return {
    pilotList: pilotList,
    coPilotList: coPilotList,
    flightAttendantList: flightAttendantList,
  };
}

export function mergeIds(...lists) {
  let finalIds = [];
  lists.forEach((list) => {
    list.forEach((item) => {
      finalIds.push(item.id);
    });
  });
  return finalIds;
}
