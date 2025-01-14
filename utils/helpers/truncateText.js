export const truncateText = (text, maxLength) => {
  if (!text) return "Not specified";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
