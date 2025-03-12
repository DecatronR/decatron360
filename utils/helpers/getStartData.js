export function getStartDate() {
  const now = new Date();
  now.setDate(now.getDate() + 1); // Add 1 day (24 hours)

  // Format the date as "DD MMMM YYYY"
  const options = { day: "2-digit", month: "long", year: "numeric" };
  return now.toLocaleDateString("en-GB", options);
}
