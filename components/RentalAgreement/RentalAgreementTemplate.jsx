import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: { marginBottom: 5, textAlign: "justify" },
  signature: { marginTop: 20, textAlign: "left" },
});

const RentalAgreementTemplate = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>TENANCY AGREEMENT</Text>
        <Text style={styles.text}>BETWEEN</Text>
        <Text style={styles.text}>ALHAJI GANIYU SIKIRU ABOLAJI (LANDLORD)</Text>
        <Text style={styles.text}>AND</Text>
        <Text style={styles.text}>MR AWAJIOGAK AYAUWU (TENANT)</Text>
        <Text style={styles.text}>
          IN RESPECT OF THAT 3 BEDROOM FLAT SITUATE AT PAUL EKANEM STREET
          ABRAHAM ADESANYA, AJAH, LAGOS
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>Prepared By:</Text>
        <Text style={styles.text}>OLUWASEGUN ODUNSI ESQ, LLM.</Text>
        <Text style={styles.text}>FOR: KINGY’S ATTORNEYS</Text>
        <Text style={styles.text}>LEGAL PRACTITIONERS,</Text>
        <Text style={styles.text}>
          SUIT 16, AMA-BEC PLAZA, OFF ADDOH ROAD, LEKKI-AJAH, LAGOS.
        </Text>
        <Text style={styles.text}>07046228252</Text>
        <Text style={styles.text}>
          kyattorneys@gmail.com | info@kingysattorneys.com
        </Text>
        <Text style={styles.text}>www.kingysattorneys.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          THIS TENANCY AGREEMENT is made this………… day of ……………………2020;
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>WHEREAS:</Text>
        <Text style={styles.text}>
          The Landlord is the owner of the 3 Bedroom Flat Situate at Paul Ekanem
          Street Abraham Adesanya, Ajah, Lagos which the Landlord has agreed to
          let and the Tenant has agreed to take same at a fixed rent of
          N900,000.00 (NINE HUNDRED THOUSAND NAIRA ONLY).
        </Text>
        <Text style={styles.text}>
          The Landlord and Tenant have agreed to observe the covenants herein
          contained.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>NOW IT IS HEREBY AGREED AS FOLLOWS:</Text>
        <Text style={styles.text}>
          IN PURSUANCE of the said agreement and in consideration of the rent
          herein reserved and the covenants on the part of the Landlord and
          Tenant herein contained, the Landlord hereby lets UNTO the Tenant ALL
          THAT 3 Bedroom Flat Situate at Paul Ekanem Street Abraham Adesanya,
          Ajah, Lagos (herein referred to as THE PROPERTY).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          The Tenant shall pay a fixed rent of N900,000.00 (NINE HUNDRED
          THOUSAND NAIRA ONLY) payable in advance at the commencement of this
          agreement, the receipt of which the landlord acknowledges.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          THE TENANT HEREBY COVENANTS WITH THE LANDLORD AS FOLLOWS:
        </Text>
        <Text style={styles.text}>
          1. To pay all electricity charges and ensure that all applicable fees
          are promptly paid.
        </Text>
        <Text style={styles.text}>
          2. To pay for security charges and cooperate in maintaining the
          building.
        </Text>
        <Text style={styles.text}>
          3. To use the premises only for residential purposes.
        </Text>
        <Text style={styles.text}>
          4. Not to assign, sub-let, or alter the premises without prior
          consent.
        </Text>
        <Text style={styles.text}>
          5. To keep the property in good condition and adhere to sanitary
          standards.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>
          THE LANDLORD HEREBY COVENANTS WITH THE TENANT AS FOLLOWS:
        </Text>
        <Text style={styles.text}>
          1. The Tenant shall enjoy peaceful occupation of the premises.
        </Text>
        <Text style={styles.text}>
          2. The Landlord shall not withhold reasonable requests made by the
          Tenant.
        </Text>
        <Text style={styles.text}>
          3. The Landlord shall provide one-month notice for possession
          recovery.
        </Text>
      </View>

      <View style={styles.signature}>
        <Text style={styles.text}>
          IN WITNESS WHEREOF, the parties have executed this Agreement.
        </Text>
        <Text style={styles.text}>SIGNED, SEALED AND DELIVERED:</Text>
        <Text style={styles.text}>By the within-Named “LANDLORD”</Text>
        <Text style={styles.text}>Alhaji Ganiyu Sikiru Abolaji</Text>
        <Text>________________________</Text>
        <Text>Signature</Text>
      </View>

      <View style={styles.signature}>
        <Text style={styles.text}>IN THE PRESENCE OF:</Text>
        <Text style={styles.text}>NAME: _________________________</Text>
        <Text style={styles.text}>ADDRESS: _________________________</Text>
        <Text style={styles.text}>OCCUPATION: _________________________</Text>
        <Text style={styles.text}>SIGNATURE: _________________________</Text>
      </View>

      <View style={styles.signature}>
        <Text style={styles.text}>SIGNED, SEALED AND DELIVERED:</Text>
        <Text style={styles.text}>By the within-named “TENANT”</Text>
        <Text style={styles.text}>MR Awajiogak Ayauwu</Text>
        <Text>________________________</Text>
        <Text>Signature</Text>
      </View>

      <View style={styles.signature}>
        <Text style={styles.text}>IN THE PRESENCE OF:</Text>
        <Text style={styles.text}>NAME: _________________________</Text>
        <Text style={styles.text}>ADDRESS: _________________________</Text>
        <Text style={styles.text}>OCCUPATION: _________________________</Text>
        <Text style={styles.text}>SIGNATURE: _________________________</Text>
      </View>
    </Page>
  </Document>
);

export default RentalAgreementTemplate;
