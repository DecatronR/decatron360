export const generateRandomWord = () => {
  const words = ["apple", "banana", "carrot", "delta", "energy", "forest"];
  return words[Math.floor(Math.random() * words.length)];
};

export const generateRandomUrl = () => {
  const urls = [
    "https://example.com",
    "https://test.com",
    "https://random.com",
  ];
  return urls[Math.floor(Math.random() * urls.length)];
};
