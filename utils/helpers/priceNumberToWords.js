import numberToWordsLib from "number-to-words";

export function numberToWords(amount) {
  // Ensure amount is a string and remove the currency symbol (₦), commas, and spaces
  const cleanAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));

  if (isNaN(cleanAmount)) {
    throw new Error("Invalid amount format");
  }

  // Convert whole number part to words
  const nairaPart = Math.floor(cleanAmount);
  const nairaInWords = numberToWordsLib
    .toWords(nairaPart)
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word

  // Check if there's a kobo (decimal part)
  const koboPart = Math.round((cleanAmount - nairaPart) * 100);
  const koboInWords =
    koboPart > 0 ? ` And ${numberToWordsLib.toWords(koboPart)} Kobo` : "";

  return `${nairaInWords} Naira${koboInWords} Only`;
}
