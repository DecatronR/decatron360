/**
 * Generates a unique payment reference based on the type and timestamp.
 * @param {"inspection" | "rent"} type - The type of payment (either "inspection" or "rent").
 * @returns {string} - Unique payment reference.
 */
export const generatePaymentReference = (type) => {
  const prefix =
    type === "inspection" ? "INS" : type === "rent" ? "RNT" : "UNK";
  const timestamp = Date.now(); // Gets the current timestamp in milliseconds
  return `${prefix}-${timestamp}`;
};

// Example Usage
console.log(generatePaymentReference("inspection")); // INS-1710345689245
console.log(generatePaymentReference("rent")); // RNT-1710345689245
