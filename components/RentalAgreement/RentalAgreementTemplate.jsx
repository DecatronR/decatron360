import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "left",
  },
  text: { fontSize: 12, marginBottom: 5 },
  boldText: { fontSize: 12, fontWeight: "bold", color: "#19738D" },
});

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
        <Text style={styles.title}>TENANCY AGREEMENT TEMPLATE</Text>
        <Text style={styles.text}>
          THIS TENANCY AGREEMENT is made this………… day of ……………………20…;
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>BETWEEN</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{ownerName}</Text>(Hereinafter called
          the “LANDLORD” which expression shall where the context so admits
          include his Legal and Personal Representatives, assigns and
          successors-in-title) of the ONE PART.
        </Text>
        <Text style={styles.text}>AND</Text>
        <Text style={styles.text}>
          <Text style={styles.boldText}>{tenantName}</Text>(Hereinafter called
          the “TENANT” which expression shall where the context so admits
          include his Legal and Personal Representatives, assigns and
          successors-in-title) of the OTHER PART.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subTitle}>WHEREAS:</Text>
        <Text style={styles.text}>
          The Landlord is the owner of the property located at _____//House and
          stree number, {propertyNeighbourhood}, {propertyState}.___
          (hereinafter referred to as "THE PROPERTY"), which the Landlord has
          agreed to let and the Tenant has agreed to rent at a fixed rent of
          __________________________ (______________________). The Landlord and
          Tenant have agreed to observe the covenants herein contained.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subTitle}>1. RENT AND DURATION</Text>
        <Text style={styles.text}>
          1.1 The Landlord hereby lets the property to the Tenant for a fixed
          term of ___1 year____ (beginning from ___//1 week from signed renntal
          agreement signed__ and ending on __//365 days after start date__) at a
          fixed rent of ___//Rent price in words{" "}
          <Text style={styles.boldText}>NGN{rentPrice}</Text> {""} payable in
          advance at the commencement of this agreement, the receipt of which
          the Landlord acknowledges.
        </Text>

        <Text style={styles.text}>
          1.2 The Tenant shall pay a Refundable Caution Fee of _One Hundred
          Thousand Naira only_//Caution fee in words__{" "}
          <Text style={styles.boldText}>
            {""}(NGN100,000) {""}
          </Text>
          , which shall be refunded at the expiration of the tenancy period,
          provided there are no outstanding damages or unpaid dues.
        </Text>
        <Text style={styles.text}>
          1.3 The Tenant agrees to pay a Transaction Fee of{" "}
          <Text style={styles.boldText}>15%</Text> {""}
          which is
          <Text style={styles.boldText}>Calculate 15% of rent price</Text>,
          covering agency fee, administrative and processing costs related to
          the tenancy agreement, as well as Decatron platform charges.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>NOW IT IS HEREBY AGREED AS FOLLOWS:</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>2. TENANT’S OBLIGATIONS</Text>
        <Text style={styles.text}>
          2.1 The Tenant covenants with the Landlord as follows:
        </Text>
        <Text style={styles.text}>
          - To pay all applicable charges, including electricity fees, promptly
          and provide proof of payment every three months or upon request.
        </Text>
        <Text style={styles.text}>
          - To pay for security charges where necessary, ensuring the safety of
          all occupants.
        </Text>
        <Text style={styles.text}>
          - To cooperate with co-tenants in maintaining cleanliness and good
          condition of the premises.
        </Text>
        <Text style={styles.text}>
          - To use the premises for residential purposes only.
        </Text>
        <Text style={styles.text}>
          - Not to assign, sub-let, or alter the apartment without the prior
          written consent of the Landlord.
        </Text>
        <Text style={styles.text}>
          - To maintain the interior and exterior of the apartment in good
          condition.
        </Text>
        <Text style={styles.text}>
          - To adhere to proper sanitary conditions as per neighborhood
          standards.
        </Text>
        <Text style={styles.text}>
          - To repair or replace any damages caused by the Tenant or their
          dependents.
        </Text>
        <Text style={styles.text}>
          - To vacate the premises at the expiration of the tenancy unless
          renewed by mutual agreement.
        </Text>
        <Text style={styles.text}>
          - If the Tenant fails to vacate upon expiration, a mesne profit of{" "}
          {""}
          <Text style={styles.boldText}>NGN1,000</Text>
          {""}
          possession is delivered.
        </Text>
        <Text style={styles.text}>
          - To notify the Landlord at least 30 days before expiration if they
          wish to renew the tenancy.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>3. LANDLORD’S OBLIGATIONS</Text>
        <Text style={styles.text}>
          3.1 The Landlord covenants with the Tenant as follows:
        </Text>
        <Text style={styles.text}>
          - That the Tenant shall peacefully enjoy the property without
          interruption if rent is paid and covenants are observed.
        </Text>
        <Text style={styles.text}>
          - Not to unreasonably withhold consent requested by the Tenant.
        </Text>
        <Text style={styles.text}>
          - To give the Tenant a one-month notice before the expiration of the
          tenancy for the purpose of delivering vacant possession.
        </Text>
        <Text style={styles.text}>
          - This agreement obviates the requirement for statutory notices.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>4. GOVERNING LAW</Text>
        <Text style={styles.text}>
          4.1 This Agreement shall be governed and construed in accordance with
          the laws of the Federal Republic of Nigeria.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subTitle}>
          IN WITNESS WHEREOF, the parties have executed this Agreement as of the
          day and year first above written.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>SIGNED, SEALED, AND DELIVERED BY:</Text>
        <Text style={styles.text}>
          LANDLORD: _________________________________________
        </Text>
        <Text style={styles.text}>
          SIGNATURE: ________________________________________
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>IN THE PRESENCE OF:</Text>
        <Text style={styles.text}>
          NAME: _____________________________________________
        </Text>
        <Text style={styles.text}>
          ADDRESS: __________________________________________
        </Text>
        <Text style={styles.text}>
          OCCUPATION: _______________________________________
        </Text>
        <Text style={styles.text}>
          SIGNATURE: ________________________________________
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          TENANT: ___________________________________________
        </Text>
        <Text style={styles.text}>
          SIGNATURE: ________________________________________
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>IN THE PRESENCE OF:</Text>
        <Text style={styles.text}>
          NAME: _____________________________________________
        </Text>
        <Text style={styles.text}>
          ADDRESS: __________________________________________
        </Text>
        <Text style={styles.text}>
          OCCUPATION: _______________________________________
        </Text>
        <Text style={styles.text}>
          SIGNATURE: ________________________________________
        </Text>
      </View>
    </Page>
  </Document>
);

export default PDFRender;
