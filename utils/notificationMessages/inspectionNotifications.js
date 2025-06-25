// Centralized notification message templates for inspection booking

export const getAgentInspectionBookedMessage = (propertyTitle, date, time) => ({
  title: "New Inspection Booked",
  body: `A new inspection has been booked for ${propertyTitle} on ${date} at ${time}.`,
});

export const getClientInspectionConfirmedMessage = (
  propertyTitle,
  date,
  time
) => ({
  title: "Inspection Booking Confirmed",
  body: `Your inspection for ${propertyTitle} is confirmed for ${date} at ${time}.`,
});
