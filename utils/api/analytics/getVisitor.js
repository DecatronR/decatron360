export const getOrCreateVisitorId = () => {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = crypto.randomUUID(); // Or use a UUID library
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
};
