// documentFields.js
export const getDocumentFields = (documentData) => ({
  templates: {
    field_data: {
      field_text_data: {
        Address: documentData.address,
        "Price in figures": documentData.priceInFigure,
        "Price in words": documentData.priceInWords,
        "Start Date": documentData.startDate,
        Duration: documentData.duration,
        "End Date": documentData.endDate,
        "Late Payment Fee": documentData.latePaymentFee,
      },
      field_boolean_data: {},
      field_date_data: {
        Date: documentData.date,
      },
      field_radio_data: {},
      field_checkboxgroup_data: {},
    },
    notes: "",
    actions: [
      {
        recipient_name: documentData.landlordName,
        recipient_email: documentData.landlordEmail,
        action_id: "451236000000038041",
        action_type: "WITNESSSIGN",
        signing_order: 1,
        role: "LandLord",
        verify_recipient: false,
        private_notes: "",
        sub_actions: [
          {
            action_id: "451236000000038139",
            action_type: "WITNESS",
            signing_order: 3,
            role: "Landlord's witness",
            verify_recipient: false,
            private_notes: "",
            is_subaction: true,
            recipient_specified: true,
          },
        ],
      },
      {
        recipient_name: documentData.tenantName,
        recipient_email: documentData.tenantEmail,
        action_id: "451236000000038047",
        action_type: "WITNESSSIGN",
        signing_order: 2,
        role: "Tenant",
        verify_recipient: false,
        private_notes: "",
        sub_actions: [
          {
            action_id: "451236000000038145",
            action_type: "WITNESS",
            signing_order: 4,
            role: "Tenant's witness",
            verify_recipient: false,
            private_notes: "",
            is_subaction: true,
            recipient_specified: true,
          },
        ],
      },
    ],
  },
});
