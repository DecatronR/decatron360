/**
 * Generate a referral link for a user
 * @param {string} referralCode - The user's referral code
 * @param {string} baseUrl - The base URL of the application (optional)
 * @returns {string} The complete referral link
 */
export function generateReferralLink(referralCode, baseUrl = null) {
  if (!referralCode) {
    throw new Error("Referral code is required");
  }

  // Use provided baseUrl or default to current domain
  const base =
    baseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://decatron.com.ng");

  // Clean referral code (remove spaces, special chars)
  const cleanCode = referralCode.trim().replace(/[^a-zA-Z0-9]/g, "");

  // Generate clean referral link
  return `${base}/ref/${cleanCode}`;
}

/**
 * Generate a referral link with query parameter (fallback)
 * @param {string} referralCode - The user's referral code
 * @param {string} baseUrl - The base URL of the application (optional)
 * @returns {string} The complete referral link with query parameter
 */
export function generateReferralLinkWithQuery(referralCode, baseUrl = null) {
  if (!referralCode) {
    throw new Error("Referral code is required");
  }

  const base =
    baseUrl ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://decatron.com.ng");
  const cleanCode = referralCode.trim().replace(/[^a-zA-Z0-9]/g, "");

  return `${base}/property-requests/register?ref=${cleanCode}`;
}

/**
 * Validate a referral code format
 * @param {string} referralCode - The referral code to validate
 * @returns {boolean} Whether the referral code is valid
 */
export function isValidReferralCode(referralCode) {
  if (!referralCode || typeof referralCode !== "string") {
    return false;
  }

  // Check if it's alphanumeric and between 3-20 characters
  const cleanCode = referralCode.trim();
  return /^[a-zA-Z0-9]{3,20}$/.test(cleanCode);
}
