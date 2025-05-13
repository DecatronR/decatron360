import crypto from "crypto";

export const hashDocument = (document, auditTrail) => {
  // Combine document and audit trail into a single string
  const combinedData = JSON.stringify({
    document,
    auditTrail: auditTrail.map((trail) => ({
      signature: trail.signature,
      timestamp: trail.timestamp,
      ipAddress: trail.ipAddress,
      device: trail.device,
      location: trail.location,
      userAgent: trail.userAgent,
    })),
  });

  // Create SHA-256 hash
  const hash = crypto.createHash("sha256");
  hash.update(combinedData);

  return hash.digest("hex");
};
