import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

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
});

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const currentDate = new Date();
const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString(
  "default",
  {
    month: "long",
  }
)} ${currentDate.getFullYear()}`;

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
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Tenancy Agreement Template</Text>
        <Text style={styles.text}>
          THIS TENANCY AGREEMENT is made on the {formattedDate}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>BETWEEN</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{ownerName}</Text> (hereinafter called
          the “LANDLORD”, which includes their legal and personal
          representatives, assigns, and successors-in-title) of the ONE PART.
        </Text>
        <Text style={styles.text}>AND</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{tenantName}</Text> (hereinafter called
          the “TENANT”, which includes their legal and personal representatives,
          assigns, and successors-in-title) of the OTHER PART.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>WHEREAS:</Text>
        <Text style={styles.text}>
          The Landlord is the rightful owner of the property located at{" "}
          <Text style={styles.boldText}>
            {propertyHouseNumberAndStreet}, {propertyNeighbourhood},{" "}
            {propertyState}
          </Text>
          . The Landlord has agreed to lease, and the Tenant to rent, the
          property at a fixed rent of{" "}
          <Text style={styles.boldText}>NGN{rentPrice}</Text>. Both parties have
          agreed to abide by the terms outlined in this agreement.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>1. Rent and Duration</Text>
        <Text style={styles.text}>
          1.1 The tenancy is for a fixed term of{" "}
          <Text style={styles.boldText}>{rentDuration}</Text>, commencing from
          one week after the signing of this agreement and ending 365 days
          thereafter. The rent of{" "}
          <Text style={styles.boldText}>NGN{rentPrice}</Text> is payable in
          advance.
        </Text>
        <Text style={styles.text}>
          1.2 A refundable caution fee of{" "}
          <Text style={styles.boldText}>NGN{cautionFee}</Text> is payable and
          shall be refunded at the end of the tenancy period, subject to
          property inspection.
        </Text>
        <Text style={styles.text}>
          1.3 An agency/transaction fee of{" "}
          <Text style={styles.boldText}>15%</Text> of the rent price applies for
          administrative and processing costs.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>2. Tenant’s Obligations</Text>
        <Text style={styles.text}>The Tenant agrees to:</Text>
        {[
          "Pay all applicable utility and security charges promptly.",
          "Maintain cleanliness and good condition of the premises.",
          "Use the property solely for residential purposes.",
          "Obtain written consent before sub-letting or making alterations.",
          "Repair any damages caused by themselves or their visitors.",
          "Vacate upon expiry unless renewed by agreement.",
          "Pay NGN1,000 as mesne profit for each day of illegal occupation after expiry.",
          "Notify the Landlord at least 30 days before expiration if intending to renew.",
        ].map((item, index) => (
          <Text key={index} style={styles.bulletPoint}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>3. Landlord’s Obligations</Text>
        <Text style={styles.text}>The Landlord agrees to:</Text>
        {[
          "Ensure peaceful possession by the Tenant upon timely payment.",
          "Not unreasonably withhold required consents.",
          "Provide one month’s notice before expiration for possession delivery.",
        ].map((item, index) => (
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
    </Page>
  </Document>
);

export default PDFRender;
