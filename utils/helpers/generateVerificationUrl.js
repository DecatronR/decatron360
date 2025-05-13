export const generateVerificationUrl = (contractId) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  return `${baseUrl}/verify-document/${contractId}`;
};
