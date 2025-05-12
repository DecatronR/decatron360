import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { formatDateWithOrdinal } from "utils/helpers/formatDateWithOrdinal";

// Updated clean, modern styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    lineHeight: 1.5,
    color: "#333",
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#19738D",
    textTransform: "uppercase",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#19738D",
    textDecoration: "underline",
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: "justify",
  },
  boldText: {
    fontWeight: "bold",
    color: "#19738D",
  },
  bulletPoint: {
    marginLeft: 12,
    marginBottom: 5,
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "20%",
    fontSize: 80,
    color: "#19738D",
    opacity: 0.1,
    transform: "rotate(-30deg)",
    zIndex: 0,
  },
  signatureSection: {
    marginTop: 40,
    borderTop: "1px solid #19738D",
    paddingTop: 30,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20,
  },
  signatureBox: {
    width: "45%",
    padding: 15,
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  signatureLine: {
    borderBottom: "1px solid #19738D",
    marginBottom: 10,
    height: 50,
  },
  signatureText: {
    fontSize: 11,
    textAlign: "center",
    color: "#374151",
    marginBottom: 4,
  },
  signatureImage: {
    width: 180,
    height: 60,
    marginBottom: 10,
    objectFit: "contain",
  },
  signatureTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#19738D",
    marginBottom: 15,
    textAlign: "center",
  },
  witnessBox: {
    marginTop: 15,
    borderTop: "1px dashed #19738D",
    paddingTop: 15,
  },
  witnessText: {
    fontSize: 11,
    textAlign: "center",
    color: "#374151",
    marginBottom: 4,
  },
});

const cleanValue = (value) => {
  return value ? value.replace(/[^0-9.,]/g, "") : "N/A"; // Removes any non-numeric, non-comma, non-period characters
};

// Helper function to convert base64 to data URL
const base64ToDataUrl = (base64String) => {
  if (!base64String) return null;
  // Check if the string is already a data URL
  if (base64String.startsWith("data:")) return base64String;
  // Add the data URL prefix if it's not already there
  return `data:image/png;base64,${base64String}`;
};

const PDFRender = ({
  ownerName,
  tenantName,
  propertyHouseNumberAndStreet,
  propertyNeighbourhood,
  propertyState,
  rentDuration,
  rentPrice,
  cautionFee,
  agencyFee,
  latePaymentFee,
  rentAndDurationText,
  tenantObligations,
  landlordObligations,
  signatures = [],
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.watermark}>SAMPLE</Text>

      <View style={styles.section}>
        <Text style={styles.title}>Tenancy Agreement Template</Text>
        <Text style={styles.text}>
          THIS TENANCY AGREEMENT is made on the {""} {formatDateWithOrdinal()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>BETWEEN</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{ownerName}</Text> (hereinafter called
          the "LANDLORD", which includes their legal and personal
          representatives, assigns, and successors-in-title) of the ONE PART.
        </Text>
        <Text style={styles.text}>AND</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{tenantName}</Text> (hereinafter called
          the "TENANT", which includes their legal and personal representatives,
          assigns, and successors-in-title) of the OTHER PART.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>WHEREAS:</Text>
        <Text style={styles.text}>
          The Landlord is the rightful owner of the property located at{" "}
          <Text style={styles.boldText}>
            {propertyHouseNumberAndStreet}, {propertyNeighbourhood}, {""}
            {propertyState}
          </Text>
          . The Landlord has agreed to lease, and the Tenant to rent, the
          property at a fixed rent of{" "}
          <Text style={styles.boldText}>NGN{cleanValue(rentPrice)}</Text>. Both
          parties have agreed to abide by the terms outlined in this agreement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>1. Rent and Duration</Text>
        {rentAndDurationText.map((item, index) => (
          <Text key={index} style={styles.bulletPoint}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.watermark}>SAMPLE</Text>
        <Text style={styles.subTitle}>2. Tenant's Obligations</Text>
        <Text style={styles.text}>The Tenant agrees to:</Text>
        {tenantObligations.map((item, index) => (
          <Text key={index} style={styles.bulletPoint}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>3. Landlord's Obligations</Text>
        <Text style={styles.text}>The Landlord agrees to:</Text>
        {landlordObligations.map((item, index) => (
          <Text key={index} style={styles.bulletPoint}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>4. Governing Law</Text>
        <Text style={styles.text}>
          This Agreement shall be governed by and construed in accordance with
          the laws of the Federal Republic of Nigeria.
        </Text>
      </View>

      {/* Signatures Section */}
      <View style={styles.signatureSection}>
        <Text style={styles.signatureTitle}>Signatures</Text>
        <View style={styles.signatureRow}>
          {signatures.map((signature, index) => (
            <View key={index} style={styles.signatureBox}>
              {signature.signature ? (
                <Image
                  src={base64ToDataUrl(signature.signature)}
                  style={styles.signatureImage}
                />
              ) : (
                <View style={styles.signatureLine} />
              )}
              <Text style={styles.signatureText}>
                {signature.role.toUpperCase()}
              </Text>
              <Text style={styles.signatureText}>{signature.signerName}</Text>

              {signature.witness && (
                <View style={styles.witnessBox}>
                  {signature.witness.signature && (
                    <Image
                      src={base64ToDataUrl(signature.witness.signature)}
                      style={styles.signatureImage}
                    />
                  )}
                  <Text style={styles.witnessText}>WITNESS</Text>
                  <Text style={styles.witnessText}>
                    {signature.witness.name}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFRender;
