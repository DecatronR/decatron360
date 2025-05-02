export function getEndDate(startDate) {
  const start = new Date(startDate);
  start.setDate(start.getDate() + 365); // Add 365 days

  // Format the date as "DD MMMM YYYY"
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return start.toLocaleDateString("en-GB", options);
}
