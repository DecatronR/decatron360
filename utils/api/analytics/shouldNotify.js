export const shouldNotifyAgain = () => {
  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();
  const THRESHOLD = 1000 * 60 * 60 * 1; // 6 hours

  if (!lastVisit || now - parseInt(lastVisit) > THRESHOLD) {
    localStorage.setItem("lastVisit", now.toString());
    return true;
  }
  return false;
};
